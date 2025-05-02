import mongoose from "mongoose";
import Product from "./models/Product.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("✅ MongoDB Connected for SEEDING"))
  .catch((err) => console.error(err));

const generateProducts = () => {
  return Array.from({ length: 100 }, (_, index) => ({
    title: `Sản phẩm ${index + 1}`,
    description: `Sản phẩm số ${index + 1} — thiết kế đẹp, chất lượng cao.`,
    price: Math.floor(Math.random() * (1000000 - 10000 + 1) + 10000), // Giá từ 10,000₫ đến 1,000,000₫
    image: `https://picsum.photos/seed/${index + 1}/300/300`,
  }));
};

async function seed() {
  try {
    await Product.deleteMany();
    console.log("🗑️ Đã xoá toàn bộ sản phẩm cũ!");

    const products = generateProducts();
    await Product.insertMany(products);
    console.log("🌱 Đã seed 100 sản phẩm mới thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
