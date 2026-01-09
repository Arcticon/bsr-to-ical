# Stage 1: Build
FROM node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy root lockfile and workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies for the web app
RUN pnpm install --filter frontend

# Copy source and build
COPY apps/frontend ./apps/frontend
RUN pnpm --filter frontend build

# Stage 2: Production Runner
FROM node:24-alpine AS runner
# Set the placeholder during build time
ENV VITE_BACKEND_URL=__VITE_BACKEND_URL_PLACEHOLDER__
WORKDIR /app
ENV NODE_ENV=production

# TanStack Start (Nitro) builds into the .output directory
COPY --from=builder /app/apps/frontend/.output ./.output
COPY apps/frontend/entrypoint.sh ./entrypoint.sh

# Ensure the script is executable
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]