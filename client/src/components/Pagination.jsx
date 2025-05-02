import React from "react";
import ReactPaginate from "react-paginate";

function Pagination({ pageCount, currentPage, onPageChange }) {
  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <ReactPaginate
        breakLabel="..."
        nextLabel="Sau >"
        onPageChange={onPageChange}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        forcePage={currentPage}
        previousLabel="< Trước"
        renderOnZeroPageCount={null}
        containerClassName="flex items-center space-x-1"
        pageLinkClassName="px-3 py-1 md:px-4 md:py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-sm md:text-base"
        previousLinkClassName="px-3 py-1 md:px-4 md:py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-sm md:text-base"
        nextLinkClassName="px-3 py-1 md:px-4 md:py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-sm md:text-base"
        activeLinkClassName="bg-blue-500 text-white border-blue-500"
        disabledLinkClassName="text-gray-300 cursor-not-allowed border-gray-300"
        breakLinkClassName="px-3 py-1 md:px-4 md:py-2 text-gray-500"
      />
      <span className="text-sm md:text-base text-gray-600 mt-3">
        Trang {pageCount === 0 ? 0 : currentPage + 1} / {pageCount}
      </span>
    </div>
  );
}

export default Pagination;
