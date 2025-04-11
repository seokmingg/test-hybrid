# 빌드 스테이지
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 실행 스테이지
FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# ✅ build-args 선언 (실제 실행환경에 주입)

ARG FRONTEND_URL
ARG BACKEND_URL
ARG POSTGRES_HOST
ARG POSTGRES_USERNAME
ARG POSTGRES_PASSWORD
ARG POSTGRES_DBNAME
ARG JWT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG KAKAO_CLIENT_ID
ARG KAKAO_CLIENT_SECRET

# ✅ 런타임에서 사용할 환경변수 설정
ENV NODE_ENV=production
ENV FRONTEND_URL=$FRONTEND_URL
ENV BACKEND_URL=$BACKEND_URL
ENV POSTGRES_PORT=5432


ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start:prod"]