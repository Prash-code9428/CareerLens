# ==============================================================================
# CareerLens Backend Production Dockerfile for Google Cloud Run
# ==============================================================================
# Base image: Official Node.js 20 LTS on Alpine Linux for a minimal attack surface
FROM node:20-alpine

# Set environment to production
ENV NODE_ENV=production
ENV PORT=8080

# Set working directory
WORKDIR /app

# Copy package manifests first for efficient Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy backend source code into the container image
COPY server.js ./
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY services ./services
COPY utils ./utils

# Run as non-root user for container security hardening
USER node

# Expose container port (Cloud Run sets PORT dynamically at runtime)
EXPOSE 8080

# Start production server
CMD ["node", "server.js"]
