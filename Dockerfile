# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React (sẽ tạo ra thư mục /app/build)
RUN npm run build

# Stage 2: Serve với Nginx và chạy json-server
FROM nginx:alpine

# Cài đặt Node.js để chạy json-server
RUN apk add --no-cache nodejs npm

# Copy các file đã build từ builder stage sang thư mục phục vụ của Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy database
COPY src/bao.json /app/db.json

# Cài đặt json-server
RUN npm install -g json-server@0.17.4

# Copy cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Chạy Nginx và json-server song song
CMD json-server --watch /app/db.json --port 2300 --host 127.0.0.1 & nginx -g "daemon off;"
