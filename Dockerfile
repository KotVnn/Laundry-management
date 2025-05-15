# ⛳ Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Cài đặt dependencies
RUN npm install

# Build production
RUN npm run build

# ⛳ Stage 2: Run production
FROM node:22-alpine AS runner

# Cài thêm nếu cần hỗ trợ font hoặc image xử lý:
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy output standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Nếu bạn dùng `.env.production`
COPY --from=builder /app/.env.production .env

EXPOSE 3000

# Chạy app
CMD ["node", "server.js"]
