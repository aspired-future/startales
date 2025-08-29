FROM node:18-alpine

WORKDIR /app

# Copy package files from project root
COPY package*.json ./

# Install dependencies
RUN npm install express cors socket.io --save

# Copy the API server
COPY docker_galaxy/services/policy-advisor/policy-advisor-api.cjs ./

# Expose port
EXPOSE 4004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4004/api/health || exit 1

# Start the server
CMD ["node", "policy-advisor-api.cjs"]

