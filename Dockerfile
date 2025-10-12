
# Use Bun as base image
FROM oven/bun:1.1-alpine AS base

WORKDIR /app

# Install dependencies stage
FROM base AS dependencies

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Install all dependencies (including dev) for building
FROM base AS build-deps

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build stage (if needed for production)
FROM base AS build

COPY --from=build-deps /app/node_modules ./node_modules
COPY . .

# Generate Drizzle types if needed
RUN bun run drizzle-kit generate || true

# Production stage
FROM base AS production

ENV NODE_ENV=production

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code (Bun can run TypeScript directly)
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

# Copy migrations if they exist
COPY --from=build /app/src/db/migrations ./src/db/migrations

# Expose the port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e 'fetch("http://localhost:3333").then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))'

# Start the application
# Bun can run TypeScript directly with ESM support
CMD ["bun", "run", "src/index.ts"]