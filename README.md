🛒 WEBSITE THƯƠNG MẠI ĐIỆN TỬ - FULLSTACK

Dự án này bao gồm frontend (React + Vite + TailwindCSS) và backend (Node.js + Express + MongoDB + JWT)

----------------------
📁 CẤU TRÚC DỰ ÁN

ecommerce/
├── client/       # Frontend: React + Vite
└── server/       # Backend: Node.js + Express + MongoDB

----------------------
🚀 HƯỚNG DẪN CHẠY DỰ ÁN

1. Tải mã nguồn:

    git clone https://github.com/dinhanhhhh/ecommerce.git
    cd ecommerce

----------------------
🔧 KHỞI ĐỘNG BACKEND (SERVER)

Bước 1: Truy cập thư mục server:

    cd server

Bước 2: Cài đặt các thư viện cần thiết:

    npm install

Bước 3: Tạo file .env và cấu hình:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key

Bước 4: Chạy server:

    npm run dev

📌 Server chạy tại: http://localhost:5000

----------------------
🎨 KHỞI ĐỘNG FRONTEND (CLIENT)

Bước 1: Mở terminal mới và chuyển vào thư mục client:

    cd client

Bước 2: Cài đặt thư viện:

    npm install

Bước 3: Chạy ứng dụng:

    npm run dev

📌 Ứng dụng chạy tại: http://localhost:5173

----------------------
✅ CÁC CHỨC NĂNG CHÍNH

- Đăng ký / Đăng nhập với JWT
- Phân quyền người dùng (User / Admin)
- CRUD sản phẩm (chỉ Admin)
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng và xem đơn hàng
- Giao diện responsive bằng Tailwind CSS

----------------------
🧪 KIỂM TRA API

Có thể test API bằng Postman thông qua các file:

- ECommerce-API-Postman-Collection.json
- cart-api-collection.json

Thư mục `server/` còn có các file seed dữ liệu như:
- seedProduct.js
- seedCart.js
- seedOrder.js

----------------------
📄 GIẤY PHÉP

MIT License
