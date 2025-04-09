# Build stage
FROM node:18-alpine AS builder

# Build-time secret
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build Next.js app (uses NEXTAUTH_SECRET at build time)
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy artifacts
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next ./.next

# Run-time secrets
ENV NODE_ENV=production
ENV PORT=80
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

EXPOSE 80
CMD ["npm", "run", "start"]