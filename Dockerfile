# Stage 1: Build React Frontend
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production Server with Nginx and Node.js Backend (MongoDB Atlas)
FROM nginx:alpine

# Cài đặt Node.js và npm
RUN apk add --no-cache nodejs npm

# Copy file build React vào thư mục web của Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Thiết lập thư mục Backend Server
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./

# Copy cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Web) và 2300 (API)
EXPOSE 80 2300

# Chạy Backend Node.js (kết nối MongoDB Atlas) và Nginx
CMD node /app/backend/server.js & nginx -g "daemon off;"
