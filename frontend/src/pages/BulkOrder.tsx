import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

interface BulkOrderItem {
  product: Product;
  quantity: number;
}

interface BuyerDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const BulkOrderPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [bulkOrder, setBulkOrder] = useState<BulkOrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [buyerDetails, setBuyerDetails] = useState<BuyerDetails>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://freshcart-eqob.onrender.com/api/products");
        const data = response.data;

        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);

          const uniqueCategories = [...new Set(data.map((p) => p.category))];
          setCategories(uniqueCategories);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products);

          const uniqueCategories = [...new Set(data.products.map((p: { category: unknown; }) => p.category))] as string[];
          setCategories(uniqueCategories);
        } else {
          console.error("Unknown data format:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterProducts(value, selectedCategory);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    filterProducts(searchTerm, value);
  };

  const filterProducts = (search: string, category: string) => {
    let updatedProducts = [...products];

    if (search) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(search)
      );
    }

    if (category) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === category
      );
    }

    setFilteredProducts(updatedProducts);
  };

  const handleQuantityChange = (
    productId: string,
    quantity: number
  ) => {
    setBulkOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.product._id === productId);
      let updatedOrder;
      if (existingItem) {
        updatedOrder = prevOrder.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );
      } else {
        const product = products.find((p) => p._id === productId);
        if (product) {
          updatedOrder = [...prevOrder, { product, quantity }];
        }
      }
      return updatedOrder || prevOrder;
    });
  };

  const handleBuyerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitBulkOrder = async () => {
    const user_id = localStorage.getItem("userId"); // Fetch user ID from localStorage

    if (!user_id) {
      alert("User ID not found. Please log in.");
      return;
    }

    const orderDetails = {
      buyer: buyerDetails,
      order: bulkOrder,
      user_id, // Add user_id to the payload
    };

    console.log("Order details being sent:", orderDetails);

    try {
      const response = await axios.post('https://freshcart-eqob.onrender.com/api/orders/bulk-order', orderDetails);

      if (response.status === 201) {
        console.log("Order successfully stored in the database.");
        toast.success("Bulk Order Successful! 🌟");
        setBulkOrder([]);
        setBuyerDetails({
          name: "",
          email: "",
          address: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error submitting bulk order:", error);
    
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response: { data: { message: string } } };
        console.error("Error message from server:", err.response.data.message);
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("There was an issue submitting your order. Please try again.");
      }
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start bg-gradient-to-tr from-green-300 via-lime-200 to-yellow-300 py-10 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Bulk Order Page</h2>

        {/* Buyer Details Form */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Buyer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={buyerDetails.name}
              onChange={handleBuyerDetailsChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={buyerDetails.email}
              onChange={handleBuyerDetailsChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="address"
              placeholder="Shipping Address"
              value={buyerDetails.address}
              onChange={handleBuyerDetailsChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={buyerDetails.phone}
              onChange={handleBuyerDetailsChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Product Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 p-3 rounded-lg flex-grow focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Displaying filtered products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 p-6 rounded-xl shadow-md bg-gray-50 flex flex-col justify-between hover:shadow-lg transition duration-300"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-700">{product.name}</p>
                  <p className="text-gray-500 mt-2">₹{product.price}</p>
                  <p className="text-sm text-gray-400 mt-1">Stock: {product.stock}</p>
                  <p className="text-sm text-gray-400">Category: {product.category}</p>
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    defaultValue={1}
                    onChange={(e) =>
                      handleQuantityChange(product._id, parseInt(e.target.value))
                    }
                    className="border border-gray-300 p-2 rounded-lg w-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No products found!</p>
          )}
        </div>

        {/* Submit Bulk Order */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmitBulkOrder}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Submit Bulk Order
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default BulkOrderPage;
