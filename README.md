# 🛒 HomeShop - Đồ Án DevOps & Triển Khai Cloud

Dự án website thương mại điện tử **HomeShop**, được thiết kế theo kiến trúc chuẩn Fullstack (Frontend React + Backend Express + Cơ sở dữ liệu đám mây MongoDB Atlas) và triển khai tự động hóa CI/CD với Docker trên hạ tầng AWS EC2.

---

## 📁 Cấu trúc dự án (Architecture Structure)

```text
DevOps/
├── backend/                   # 🚀 MÃ NGUỒN BACKEND & DATABASE
│   ├── models/                # Schemas Mongoose (Product.js, User.js)
│   ├── bao.json               # Dữ liệu ban đầu phục vụ auto-seed
│   ├── package.json           # Dependencies backend (express, mongoose, cors, dotenv)
│   ├── server.js              # Express API Server kết nối MongoDB Atlas
│   └── README.md              # Hướng dẫn chi tiết về Backend & API
│
├── src/                       # 🎨 MÃ NGUỒN FRONTEND (REACT JS)
│   ├── Components/            # Các trang giao diện (Home, Admin, Member1-5, Detail, ...)
│   ├── App.js                 # Router & điều hướng phân quyền (Auth Guard)
│   ├── App.css                # Tùy biến kiểu dáng giao diện
│   └── index.js               # Entry point React
│
├── public/                    # Tài nguyên tĩnh (Hình ảnh, Banners, Icons)
│   └── images/                # Banners carousel, banner bedroom, hình ảnh sản phẩm
│
├── .github/workflows/         # 🔄 CI/CD Pipeline (GitHub Actions)
│   └── deploy.yml             # Tự động Build & Push Docker image lên Docker Hub
│
├── Dockerfile                 # Multi-stage Docker build (React build + Nginx + Node Backend)
├── docker-compose.yml         # File khởi chạy container môi trường local
├── docker-compose.prod.yml    # File khởi chạy container trên Cloud Server (AWS EC2)
├── Jenkinsfile                # Pipeline Jenkins phục vụ tự động hóa triển khai
├── nginx.conf                 # Cấu hình Web Server Nginx & Reverse Proxy tới API Backend
└── README.md                  # Tài liệu tổng quan dự án
```

---

## 🌐 Cơ sở dữ liệu Online (MongoDB Atlas)

* Dự án sử dụng **MongoDB Atlas** (Database online trên nền tảng đám mây) theo đúng yêu cầu đề bài.
* **Tên Database:** `homeshop`
* **Các bảng dữ liệu (Collections):**
  * `products`: 56 sản phẩm thuộc các danh mục (Phòng khách, Phòng ngủ, Bếp, Gia dụng,...).
  * `users`: Danh sách tài khoản người dùng và tài khoản quản trị viên.
* **Cơ chế đồng bộ:** Mọi thao tác Thêm / Sửa / Xóa sản phẩm và tài khoản người dùng trên trang Admin đều được cập nhật và lưu trực tiếp lên Cloud MongoDB Atlas.

---

## 🛠️ API Endpoints chính (Backend)

* **Health Check:** `GET /api/health` — Kiểm tra trạng thái máy chủ và kết nối MongoDB Atlas.
* **Sản phẩm:**
  * `GET /api/products` — Lấy danh sách sản phẩm từ MongoDB Atlas
  * `POST /api/products` — Thêm sản phẩm mới
  * `PUT /api/products/:id` — Chỉnh sửa sản phẩm
  * `DELETE /api/products/:id` — Xóa sản phẩm
* **Người dùng & Phân quyền:**
  * `GET /api/user` — Danh sách người dùng
  * `POST /api/user` — Đăng ký / thêm người dùng
  * `PUT /api/user/:id` — Cập nhật thông tin người dùng
  * `DELETE /api/user/:id` — Xóa người dùng

---

## 🚀 Triển khai & Vận hành (DevOps)

* **Cloud Server:** AWS EC2 (Ubuntu 22.04 LTS)
* **Web Server & Reverse Proxy:** Nginx (Port 80)
* **API Server:** Express.js (Port 2300, proxy qua Nginx `/api/`)
* **Containerization:** Docker & Docker Compose
* **CI/CD:** GitHub Actions tự động build Docker Image và đẩy lên Docker Hub (`quan109/front_dep:latest`).
