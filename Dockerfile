# 1️⃣ Base image ----------------------------------------------------------------
# Use the official Node.js 20 Alpine image as our base. We also configure PNPM & Corepack
# to leverage the system package manager instead of a global npm install, keeping the
# final image slim (see https://datawookie.dev/blog/2024/02/standalone-next-js-application-in-docker/).

FROM node:18-alpine AS base

# Use a dedicated location for the global pnpm store. This avoids cluttering the
# root filesystem layer and allows it to be reused between stages.
ENV PNPM_HOME="/var/lib/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable Corepack so that pnpm is available without a separate npm install step.
RUN corepack enable && corepack prepare pnpm@latest --activate

# ------------------------------------------------------------------------------
# 2️⃣ Dependencies layer --------------------------------------------------------
FROM base AS deps

# Some Next.js native dependencies expect glibc. This compatibility package keeps
# the alpine image small while satisfying those binaries.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# We only copy the files required to calculate the dependency graph – this allows
# Docker layer caching to be effective when the source code changes but the lock
# file remains the same.
COPY package.json pnpm-lock.yaml* ./

# The "--frozen-lockfile" flag guarantees reproducible builds matching the lock
# file exactly.
RUN pnpm install --frozen-lockfile --prod=false

# ------------------------------------------------------------------------------
# 3️⃣ Builder layer -------------------------------------------------------------
FROM base AS builder

WORKDIR /app

# Re-use the dependency layer for faster builds.
COPY --from=deps /app/node_modules ./node_modules

# Copy the remaining application source code.
COPY . .

# Disable Next.js telemetry during the build to avoid unnecessary noise.
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application. Because our `next.config.mjs` already specifies
# `output: \"standalone\"`, the result will be placed under `.next/standalone`.
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"] 