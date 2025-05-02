// components/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p className="text-center col-span-full text-gray-500">
          Không tìm thấy sản phẩm nào.
        </p>
      )}
    </div>
  );
}

export default React.memo(ProductGrid);
