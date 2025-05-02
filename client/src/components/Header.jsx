import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import NavLinks from "./NavLinks";
import AuthMenu from "./AuthMenu";
import CartButton from "./CartButton";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MyStore
          </Link>

          {/* Thanh tìm kiếm (ẩn trên mobile) */}
          <div className="hidden md:block flex-1 mx-4">
            <SearchBar />
          </div>

          {/* Menu điều hướng và Cart (ẩn trên mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            <AuthMenu />
            <CartButton />
          </div>

          {/* Hamburger menu (hiện trên mobile) */}
          <button
            className="md:hidden flex items-center p-2"
            onClick={() => setOpen(!open)}
            aria-label="Mở menu"
          >
            <svg
              className="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-blue-600">MyStore</span>
              <button onClick={() => setOpen(false)} aria-label="Đóng menu">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <SearchBar />
            <NavLinks />
            <AuthMenu />
            <CartButton />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
