# Build stage
FROM node:22-slim AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage - Simple static server
FROM node:22-slim

# Install serve globally for static hosting
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist /app

# Expose port 3000
EXPOSE 3000

# Start static server with SPA support
CMD ["serve", "-s", "/app", "-l", "3000"]
