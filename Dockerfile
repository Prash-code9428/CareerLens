# ==============================================================================
# CareerLens Backend Production Dockerfile for Google Cloud Run
# ==============================================================================
FROM node:22-alpine

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

# Copy server package manifests first
COPY server/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy backend source code
COPY server/server.js ./
COPY server/config ./config
COPY server/controllers ./controllers
COPY server/middleware ./middleware
COPY server/models ./models
COPY server/routes ./routes
COPY server/services ./services
COPY server/utils ./utils

USER node

EXPOSE 8080

CMD ["node", "server.js"]
