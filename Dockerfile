FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for build)
RUN npm install --no-audit --no-fund

# Install tsx globally for runtime
RUN npm install -g tsx

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Ensure critical runtime dependencies are present
RUN npm list ws || npm install ws
RUN npm list express || npm install express
RUN npm list cors || npm install cors
RUN npm list pg || npm install pg

EXPOSE 4000

CMD ["node", "--experimental-specifier-resolution=node", "dist/server/index.js"]


