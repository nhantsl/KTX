# 📚 Book Store Web App

🌐 **Demo**  
- 👉 Live: https://ktx-s4hv.onrender.com/ 
- 👉 Source Code: https://github.com/nhantsl/KTX  

---

## 📌 Giới thiệu

Đây là web quản lý kí túc xá đơn giản được xây dựng bằng **Node.js + Express** theo mô hình backend phân tầng.

Ứng dụng tập trung vào việc mô phỏng các chức năng cơ bản của một hệ thống e-commerce:

---

## 🚀 Công nghệ sử dụng

### 🔧 Backend
- Node.js (ES Modules)
- Express.js
- EJS (Template Engine)

### 🗄️ Database
- TiDB Cloud (MySQL-compatible)
- mysql2

### 🌍 Deployment
- Render (Server)
- TiDB Cloud (Database)

### ⚙️ Khác
- express-session
- dotenv
- morgan
- method-override
- Tailwind CSS

---

## 🏗️ Cấu trúc project

```
project/
├── src/
│   ├── app.js
│   ├── controllers/
│   ├── middlewares/
│
├── routers/
├── models/
├── views/
├── public/
├── server.js
└── package.json
```

---

## 🔄 Kiến trúc hệ thống

```
Route → Controller → Database
```

### Giải thích:

- **Controller**: nhận request, trả response
- **Service**: xử lý logic nghiệp vụ
- **Repository**: thao tác với database
- **Database**: lưu trữ dữ liệu

---

### Screenshot:
![Screenshot](/public/images/add.png)
![Screenshot](/public/images/admin.png)
![Screenshot](/public/images/dashboard.png)
![Screenshot](/public/images/detail.png)
![Screenshot](/public/images/home.png)
![Screenshot](/public/images/login.png)
![Screenshot](/public/images/request.png)