#Fichero actualizado 
FROM node:24-alpine3.22 AS base
RUN npm install -g pnpm@11.1.2
# Stage 1: Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files for caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
# Install dependencies
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# Stage 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma-specific: Generate the client for the container OS
# This must happen before 'pnpm run build'
RUN pnpm prisma generate

# Next.js standalone build
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN apk add --no-cache poppler-utils

# Copy the standalone output and static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run the standalone server.js
CMD ["node", "server.js"]