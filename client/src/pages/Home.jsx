// pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    // Lấy sản phẩm nổi bật
    fetch("http://localhost:5000/api/products?limit=8")
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data));

    // Lấy danh mục
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // Testimonials mẫu
    setTestimonials([
      {
        id: 1,
        name: "Chị Ngọc Anh",
        text: "Sản phẩm chất lượng, giao hàng siêu nhanh. Tôi rất hài lòng!",
        avatar: "/avatar1.jpg",
      },
      {
        id: 2,
        name: "Anh Minh Đức",
        text: "Nhân viên tư vấn nhiệt tình, giá cả hợp lý. Sẽ ủng hộ dài lâu.",
        avatar: "/avatar2.jpg",
      },
    ]);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Chào mừng đến với MyStore
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá thế giới mua sắm với hàng ngàn sản phẩm chất lượng, giá tốt
            nhất thị trường
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-all text-lg"
          >
            Mua sắm ngay
          </Link>
        </div>
      </section>

      {/* Danh mục nổi bật */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Danh mục nổi bật
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-20 h-20 mx-auto object-contain mb-4"
              />
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
          <Link
            to="/products"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Banner khuyến mãi */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12 mb-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Giảm giá lên đến 50%
          </h3>
          <p className="mb-6">
            Áp dụng cho tất cả sản phẩm điện tử từ 1/1 đến 31/1
          </p>
          <Link
            to="/products?sort=discount"
            className="inline-block bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-gray-100 transition-all"
          >
            Xem ưu đãi
          </Link>
        </div>
      </section>

      {/* Đánh giá khách hàng */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Khách hàng nói về chúng tôi
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-start mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500">Khách hàng thân thiết</p>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Đăng ký nhận ưu đãi</h3>
          <p className="mb-6 text-gray-600">
            Nhận thông báo về sản phẩm mới và khuyến mãi đặc biệt
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;
