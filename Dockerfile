# syntax=docker/dockerfile:1

# ============================================
# Base image
# ============================================
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# ============================================
# Stage 1: Install dependencies
# ============================================
FROM base AS install

# Install dev dependencies (for build)
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# ============================================
# Stage 2: Build
# ============================================
FROM base AS builder

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Copie le .env.example pour le build (variables NEXT_PUBLIC_*)
COPY .env.example .env

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# ============================================
# Stage 3: Production
# ============================================
FROM base AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Copie les fichiers nécessaires pour la production
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static

# Utilise l'utilisateur bun intégré (non-root)
USER bun

EXPOSE 8080

CMD ["bun", "server.js"]
