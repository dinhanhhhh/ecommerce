import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams(); // Lấy id sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart, setIsCheckoutOpen } = useCart();

  // Sử dụng biến môi trường cho URL backend
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Lấy chi tiết sản phẩm
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        // Sau khi có product, gọi API sản phẩm liên quan theo category
        if (data.category) {
          fetch(`${API_URL}/api/products?category=${data.category}&limit=4`)
            .then((res) => res.json())
            .then((related) => {
              // Loại bỏ sản phẩm hiện tại khỏi danh sách liên quan
              setRelatedProducts(related.filter((p) => p._id !== data._id));
            });
        }
      });
  }, [id, API_URL]);

  // Hàm xử lý thêm vào giỏ
  const handleAddToCart = async (quantity = 1) => {
    try {
      await addToCart(product._id, quantity);
      setIsCheckoutOpen(false); // Mở side cart
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
    }
  };

  if (!product) return <div className="p-4">Đang tải chi tiết sản phẩm...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Chi tiết chính */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-96 object-contain bg-white rounded-lg shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="text-xl text-blue-600 font-semibold mb-2">
            {Number(product.price).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </div>
          <p className="mb-2 text-sm text-gray-500">
            Còn lại: {product.countInStock} sản phẩm
          </p>
          <div className="mb-4">
            <span className="text-yellow-500">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
            </span>{" "}
            <span className="text-gray-600">({product.rating} sao)</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleAddToCart(1)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Thêm vào giỏ
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-32 mx-auto mb-2 object-contain"
                />
                <h3 className="font-medium text-gray-800 text-sm truncate">
                  {item.title}
                </h3>
                <p className="text-blue-500 font-semibold">
                  {Number(item.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Đánh giá khách hàng (giả lập) */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Đánh giá của khách hàng</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-700">
            “Sản phẩm đúng mô tả, giao hàng nhanh, chất lượng tốt.”
          </p>
          <p className="text-sm text-gray-500 mt-2">- Anh Nguyễn Văn A</p>
        </div>
      </div>

      {/* Chia sẻ mạng xã hội (giản lược) */}
      <div className="text-center">
        <p className="text-gray-600 mb-2">Chia sẻ sản phẩm:</p>
        <div className="flex justify-center gap-4 text-xl">
          <a href="#" className="text-blue-600">
            Facebook
          </a>
          <a href="#" className="text-pink-500">
            Instagram
          </a>
          <a href="#" className="text-blue-400">
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
