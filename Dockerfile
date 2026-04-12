# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/webapp/package*.json ./packages/webapp/
COPY scripts/ ./scripts/
RUN npm install

COPY packages/webapp/ ./packages/webapp/
RUN npm run build:webapp

# ── Stage 2: runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/packages/webapp/.output ./.output

EXPOSE 5001
ENV PORT=5001 \
    NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
