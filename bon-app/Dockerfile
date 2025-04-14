# Build stage
FROM node:20-alpine as builder

# Add labels following OCI specification
LABEL org.opencontainers.image.title="React Application"
LABEL org.opencontainers.image.description="Frontend React application"
LABEL org.opencontainers.image.version="2.0.0"
LABEL org.opencontainers.image.vendor="Your Company"
LABEL org.opencontainers.image.authors="Your Team <team@example.com>"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Install dependencies with cache optimization
COPY package*.json ./
RUN npm ci --only=production

# Copy source files
COPY tsconfig.json ./
COPY public/ public/
COPY src/ src/

# Build the application
RUN npm run build \
    && rm -rf node_modules

# Production stage
FROM node:20-alpine
WORKDIR /app

# Add non-root user
RUN addgroup -g 1001 -S app-group \
    && adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G app-group app-user \
    && chown -R app-user:app-group /app

# Copy built files from builder stage
COPY --from=builder --chown=app-user:app-group /app/build ./
COPY serve.json ./

# Install serve package globally
RUN npm install -g serve

# Switch to non-root user
USER app-user

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Expose port 80
EXPOSE 80

# Start static file server
CMD ["serve", "-s", ".", "-l", "80"]
