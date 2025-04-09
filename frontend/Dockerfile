# Build stage
FROM node:18-alpine AS builder

ARG NEXTAUTH_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG KAKAO_CLIENT_ID
ARG KAKAO_CLIENT_SECRET


WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# 빌드할 때 필요한 환경변수만 ARG로 받아 사용
RUN NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
    GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
    KAKAO_CLIENT_ID=$KAKAO_CLIENT_ID \
    KAKAO_CLIENT_SECRET=$KAKAO_CLIENT_SECRET \
    npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next ./.next

ENV NODE_ENV=production
ENV PORT=80

# 여기선 민감 정보 ENV 넣지 말고, 쿠버네티스에서 주입!
EXPOSE 80
CMD ["npm", "run", "start"]