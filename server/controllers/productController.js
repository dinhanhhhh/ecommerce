import Product from "../models/Product.js";

// Lấy danh sách tất cả sản phẩm
export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // lấy limit từ query
    const products = await Product.find().limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo sản phẩm mới (Admin)
export const createProduct = async (req, res) => {
  const { title, price, description, image } = req.body;
  try {
    const product = new Product({
      title,
      price,
      description,
      image,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm theo ID (Admin)
export const updateProduct = async (req, res) => {
  const { title, price, description, image } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.title = title;
      product.price = price;
      product.description = description;
      product.image = image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá sản phẩm theo ID (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted successfully!" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
