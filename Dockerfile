FROM node:20-alpine

# Add necessary packages for debugging and better error handling
RUN apk add --no-cache curl dumb-init

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with better error handling
RUN npm install --no-audit --no-fund --production=false

# Install tsx globally for runtime
RUN npm install -g tsx

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify critical files exist
RUN ls -la dist/src/demo/ && ls -la dist/src/server/

# Keep dev dependencies for runtime (some might be needed)
# RUN npm prune --production

# Ensure critical runtime dependencies are present with better error handling
RUN npm list express || (npm install express && echo "Installed express")
RUN npm list cors || (npm install cors && echo "Installed cors")
RUN npm list ws || (npm install ws && echo "Installed ws")
RUN npm list pg || (npm install pg && echo "Installed pg")

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 4000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

# Use dumb-init to handle signals properly and prevent zombie processes
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Default command - can be overridden by docker-compose
CMD ["node", "--experimental-specifier-resolution=node", "dist/src/server/index.js"]


