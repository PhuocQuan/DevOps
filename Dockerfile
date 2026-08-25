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

# Stage 2: Serve với Nginx
FROM nginx:alpine

# Copy các file đã build từ builder stage sang thư mục phục vụ của Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 mặc định của Nginx
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
