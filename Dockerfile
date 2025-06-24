# 1. Base image for building
FROM node:20-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 4. Copy everything needed
COPY . .

# 5. Install dependencies and build
RUN pnpm install --frozen-lockfile && pnpm build

# 6. Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy only the standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Optional: set port (default is 3000)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
