FROM node:18-alpine

WORKDIR /app

# Copy package files from project root
COPY package*.json ./

# Install dependencies including socket.io
RUN npm install express cors socket.io --save

# Copy the communication server
COPY docker/services/communication/communication-api.cjs ./

# Expose port
EXPOSE 4003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4003/api/health || exit 1

# Start the server
CMD ["node", "communication-api.cjs"]

