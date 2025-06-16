# User Management Service

Dự án quản lý người dùng sử dụng NestJS.

---

## ⚙️ Yêu cầu

- Docker
- Docker Compose (Kèm sẵn nếu dùng Docker Desktop)

---

## 🧪 Cấu hình môi trường

Tạo file `.env` tại thư mục gốc, cấu trúc giống với file .env-example và điền đầy đủ các giá trị cần thiết:

```env
DB_HOST = 
DB_USER = 
DB_PASS = 
DB_NAME = 
DB_PORT = 
JWT_SECRET = 
JWT_REFRESH_SECRET=
DEFAULT_ADMIN_USERNAME =
DEFAULT_ADMIN_PASSWORD = 
REDIS_HOST = 
REDIS_PORT = 
PORT =
```

## 🚀 Khởi động ứng dụng

Mở terminal, cd vào thư mục chứa project và chạy lệnh:

```bash
docker compose up --build
```
