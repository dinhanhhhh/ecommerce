import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart, setIsCheckoutOpen } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id, 1);
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex-col"
    >
      <div className="relative flex-1">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain p-4 transition-opacity group-hover:opacity-90"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {product.title}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm h-12 overflow-hidden mb-4">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-blue-600">
            {Number(product.price).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>

          {/* Responsive Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`
              flex items-center justify-center
              bg-blue-500 text-white rounded-lg transition-colors shadow-lg
              hover:bg-blue-600
              px-4 py-2 text-sm
              w-10 h-10
              md:w-10 md:h-10 md:rounded-full md:px-0 md:py-0
              group-hover:opacity-100 opacity-100 md:opacity-0
              md:group-hover:opacity-100
            `}
            aria-label="Thêm vào giỏ hàng"
          >
            {/* Icon luôn hiển thị trên desktop, ẩn trên mobile */}
            <svg
              className="w-5 h-5 hidden md:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {/* Text luôn hiển thị trên mobile, ẩn trên desktop */}
            <span className="md:hidden">Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
