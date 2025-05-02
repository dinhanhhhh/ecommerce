import { useState } from "react";
import PropTypes from "prop-types";

function CheckoutForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { name, email, address } = formData;
    if (!name.trim() || !email.trim() || !address.trim()) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      setError("");
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Họ và tên:
        </label>
        <input
          id="name"
          type="text"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Nguyễn Văn A"
          aria-label="Họ và tên"
          aria-invalid={!!error}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email:
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="example@email.com"
          aria-label="Email"
          aria-invalid={!!error}
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Địa chỉ:
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Số nhà, đường, phường, quận, thành phố"
          aria-label="Địa chỉ"
          aria-invalid={!!error}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-70"
      >
        {isSubmitting ? "Đang xử lý..." : "Xác nhận đơn hàng"}
      </button>
    </form>
  );
}

CheckoutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default CheckoutForm;
