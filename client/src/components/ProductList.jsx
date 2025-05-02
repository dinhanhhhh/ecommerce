import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

const itemsPerPage = 12;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search")?.toLowerCase() || "";

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/products`
        );
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setFetchError("Không thể tải danh sách sản phẩm." , error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm)
      ),
    [products, searchTerm]
  );

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get items for current page
  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Handle pagination
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset về trang đầu khi searchTerm đổi
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  return (
    <section className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md h-80 animate-pulse"
            ></div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="text-center text-red-500 py-8">{fetchError}</div>
      ) : filteredProducts.length > 0 ? (
        <>
          <ProductGrid products={currentItems} />
          <div className="mt-6 flex justify-center">
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={handlePageClick}
            />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          Không tìm thấy sản phẩm phù hợp.
        </p>
      )}
    </section>
  );
}

export default ProductList;
