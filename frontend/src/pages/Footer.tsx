import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-600 via-lime-500 to-yellow-400 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Fresh Cart 🌾</h2>
          <p className="text-white/90">
            Fresh fruits and vegetables delivered from trusted farms directly to your doorstep. 
            Stay healthy, stay happy with AgroFix! 🍏🥕
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline hover:text-green-900">Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:underline hover:text-green-900">Products</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:underline hover:text-green-900">Cart</Link>
            </li>
            <li>
              <Link to="/orders" className="hover:underline hover:text-green-900">My Orders</Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-white/90 mb-4">
            📍 Vijayawada, Andhra Pradesh  
          </p>
          <p className="text-white/90 mb-4">
            📞 +91 9876543210
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-green-900 text-2xl">📸</a>
            <a href="#" className="hover:text-green-900 text-2xl">📘</a>
            <a href="#" className="hover:text-green-900 text-2xl">🐦</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-white/80 mt-10 text-sm">
        © {new Date().getFullYear()} AgroFix. All rights reserved. 🌱
      </div>
    </footer>
  );
};

export default Footer;
