import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isUserAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  setIsUserAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdminAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({
  isUserAuthenticated,
  isAdminAuthenticated,
  setIsUserAuthenticated,
  setIsAdminAuthenticated,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isUserAuthenticated");
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("userRole");
    setIsUserAuthenticated(false);
    setIsAdminAuthenticated(false);
    setIsMenuOpen(false);
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <nav className="bg-gradient-to-r from-green-400 via-lime-400 to-yellow-300 text-white shadow-lg font-semibold">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide text-white drop-shadow-md">
          🍎 FreshCart
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {!isAdminRoute && <Link to="/" className="hover:text-orange-400 transition">Home</Link>}

          {(isUserAuthenticated || isAdminAuthenticated) ? (
            <>
              {isAdminAuthenticated ? (
                <>
                  <Link to="/admin" className="hover:text-orange-400 transition">Admin Dashboard</Link>
                  <button onClick={handleLogout} className="hover:text-orange-400 transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/products" className="hover:text-orange-400 transition">Products</Link>
                  <Link to="/cart" className="hover:text-orange-400 transition">Cart</Link>
                  <Link to="/bulk-orders" className="hover:text-orange-400 transition">Bulk Orders</Link>
                  <Link to="/orders" className="hover:text-orange-400 transition">My Orders</Link>
                  <button onClick={handleLogout} className="hover:text-orange-400 transition">Logout</button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:text-orange-400 transition">Sign In</Link>
              <Link to="/signup" className="hover:text-orange-400 transition">Sign Up</Link>
              <Link to="/admin/signin" className="hover:text-orange-400 transition">Admin Sign In</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu with Framer Motion animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-gradient-to-b from-green-300 via-lime-300 to-yellow-200 overflow-hidden"
          >
            <div className="flex flex-col items-start p-4 space-y-4 text-green-900 font-semibold">
              {!isAdminRoute && (
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Home</Link>
              )}
              {(isUserAuthenticated || isAdminAuthenticated) ? (
                <>
                  {isAdminAuthenticated ? (
                    <>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Admin Dashboard</Link>
                      <button onClick={handleLogout} className="hover:text-orange-400 transition">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Products</Link>
                      <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Cart</Link>
                      <Link to="/bulk-orders" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Bulk Orders</Link>
                      <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">My Orders</Link>
                      <button onClick={handleLogout} className="hover:text-orange-400 transition">Logout</button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Sign In</Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Sign Up</Link>
                  <Link to="/admin/signin" onClick={() => setIsMenuOpen(false)} className="hover:text-orange-400 transition">Admin Sign In</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
