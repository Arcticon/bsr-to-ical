# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN corepack enable
RUN corepack install

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Stage 2: Production
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN corepack enable
RUN corepack install
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "--env-file=.env", "dist/index.js"]