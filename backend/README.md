# HomeShop Backend API - MongoDB Atlas Online

Thư mục này chứa toàn bộ mã nguồn **Backend** của dự án HomeShop, được xây dựng bằng **Node.js**, **Express.js** và tích hợp trực tiếp với **MongoDB Atlas (Cơ sở dữ liệu đám mây trực tuyến)** theo yêu cầu đồ án DevOps.

---

## 1. Cấu trúc thư mục Backend

```text
backend/
├── models/
│   ├── Product.js          # Mongoose Schema & Model cho bảng Sản phẩm
│   └── User.js             # Mongoose Schema & Model cho bảng Người dùng / Admin
├── auth-server/            # Phiên bản server xác thực cũ (lưu trữ tham khảo)
├── bao.json                # Dữ liệu ban đầu (56 sản phẩm & tài khoản mẫu để auto-seed)
├── package.json            # Cấu hình dependencies (express, mongoose, cors, dotenv)
├── package-lock.json       # Khóa phiên bản dependencies
├── server.js               # Điểm khởi chạy chính của Backend API & Mongoose connection
└── README.md               # Tài liệu hướng dẫn Backend
```

---

## 2. Công nghệ sử dụng

* **Runtime:** Node.js
* **Framework:** Express.js
* **Cơ sở dữ liệu:** MongoDB Atlas (Cloud Database Cluster 0)
* **Thư viện kết nối ODM:** Mongoose 8.x
* **Bảo mật & Tương thích:** CORS middleware, JSON parser, Dotenv

---

## 3. Cấu hình Cơ sở dữ liệu (MongoDB Atlas)

* **Cluster Host:** `cluster0.jzdibrv.mongodb.net`
* **Database Name:** `homeshop`
* **Collections:**
  * `products`: Lưu trữ 56 sản phẩm với đầy đủ thông tin (tên, giá, số lượng, mô tả, hình ảnh).
  * `users`: Lưu trữ thông tin tài khoản, mật khẩu, quyền quản trị (admin / user).
* **Cơ chế Auto-seed:** Khi khởi động lần đầu, nếu database rỗng, server sẽ tự động trích xuất dữ liệu từ `bao.json` và nạp trực tiếp lên MongoDB Atlas Cloud.

---

## 4. Danh sách API Endpoints

### A. Quản lý Sản phẩm (Products)
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/products` | Lấy danh sách tất cả sản phẩm từ MongoDB |
| `POST` | `/api/products` | Thêm một sản phẩm mới lên database |
| `PUT` | `/api/products/:id` | Cập nhật thông tin sản phẩm theo `_id` |
| `DELETE` | `/api/products/:id` | Xóa sản phẩm khỏi database theo `_id` |

### B. Quản lý Người dùng & Tài khoản (Users)
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/user` | Lấy danh sách tất cả tài khoản |
| `POST` | `/api/user` | Đăng ký tài khoản mới hoặc tạo người dùng từ Admin |
| `PUT` | `/api/user/:id` | Cập nhật thông tin cá nhân / mật khẩu / vai trò |
| `DELETE` | `/api/user/:id` | Xóa tài khoản theo `_id` |

### C. Kiểm tra trạng thái hệ thống (Health Check)
| Method | Endpoint | Trả về |
|---|---|---|
| `GET` | `/api/health` | `{"status": "ok", "database": "MongoDB Atlas Connected", "timestamp": "..."}` |

---

## 5. Hướng dẫn chạy Backend cục bộ (Local Development)

Nếu muốn khởi động riêng phần Backend trên máy cá nhân:

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện cần thiết
npm install

# 3. Chạy server backend
npm start
```

Server sẽ lắng nghe tại cổng `http://localhost:2300` và tự động kết nối đến MongoDB Atlas Cloud.
