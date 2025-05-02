import mongoose from "mongoose";
import Order from "./models/Order.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("✅ MongoDB Connected for Order Seeding"))
  .catch((err) => console.error(err));

const sampleOrders = [
  {
    user: "680785846c4a4204ddaeeda7", // Thay bằng _id thật từ User
    orderItems: [
      { product: "660c0fe4c12fb0a7c6a9fbcc", quantity: 1 },
      { product: "660c0fe4c12fb0a7c6a9fbcd", quantity: 3 },
    ],
    shippingAddress: {
      address: "123 Đường ABC",
      city: "Hà Nội",
      postalCode: "100000",
      country: "Vietnam",
    },
    paymentMethod: "Cash on Delivery",
    totalPrice: 1000000,
    isPaid: false,
    isDelivered: false,
  },
];

async function seedOrder() {
  try {
    await Order.deleteMany();
    console.log("🗑️ Đã xoá toàn bộ đơn hàng cũ!");

    await Order.insertMany(sampleOrders);
    console.log("📦 Đã seed đơn hàng mẫu thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi seed Order:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedOrder();
