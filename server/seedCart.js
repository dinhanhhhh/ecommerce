import mongoose from "mongoose";
import Cart from "./models/Cart.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("✅ MongoDB Connected for Cart Seeding"))
  .catch((err) => console.error(err));

const sampleCart = [
  {
    user: "660c0fe4c12fb0a7c6a9fbbb", // Thay bằng _id thật từ User
    items: [
      { product: "660c0fe4c12fb0a7c6a9fbcc", quantity: 2 },
      { product: "660c0fe4c12fb0a7c6a9fbcd", quantity: 1 },
    ],
  },
];

async function seedCart() {
  try {
    await Cart.deleteMany();
    console.log("🗑️ Đã xoá toàn bộ giỏ hàng cũ!");

    await Cart.insertMany(sampleCart);
    console.log("🛒 Đã seed giỏ hàng mẫu thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi seed Cart:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedCart();
