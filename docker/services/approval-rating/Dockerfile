FROM node:18-alpine

WORKDIR /app

# Copy package files from project root
COPY package*.json ./

# Install only the dependencies we need
RUN npm install express cors --save

# Copy the approval rating server
COPY docker/services/approval-rating/approval-rating-api.cjs ./

# Expose port
EXPOSE 4002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4002/api/health || exit 1

# Start the server
CMD ["node", "approval-rating-api.cjs"]

