import { useCart } from "../context/CartContext";

function CartButton() {
  const { getTotalItems, setIsCheckoutOpen } = useCart();

  return (
    <button
      onClick={() => setIsCheckoutOpen(true)}
      className="relative flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200 group"
      aria-label="Mở giỏ hàng"
    >
      {/* SVG icon đẹp, hiện đại hơn */}
      <span className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-7 h-7 text-blue-500 group-hover:text-blue-700 transition-colors drop-shadow"
        >
          <path d="M7 20a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm7 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7.16 17h7.68c.78 0 1.46-.45 1.75-1.14l3.24-7.24A1 1 0 0 0 19 7H6.21l-.94-2.36A1 1 0 0 0 4.36 4H2v2h1.36l3.6 9.1-1.35 2.44A2 2 0 0 0 7 20h10v-2H7.42l.74-1.34ZM6.16 9h11.24l-2.76 6H8.53l-2.37-6Z" />
        </svg>
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-br from-pink-500 to-red-500 text-white border-2 border-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
            {getTotalItems()}
          </span>
        )}
      </span>
      <span className="font-semibold text-blue-700 group-hover:text-blue-900 transition-colors">
        Giỏ hàng
      </span>
    </button>
  );
}

export default CartButton;
