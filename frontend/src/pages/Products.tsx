import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

interface CartItem extends Product {
  quantity: number;
}

const FetchProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      toast.info("Loading products...", { autoClose: 1000 });
      try {
        const response = await axios.get("https://freshcart-eqob.onrender.com/api/products");
        const data = response.data;

        let loadedProducts: Product[] = [];
        if (Array.isArray(data)) {
          loadedProducts = data;
        } else if (data && Array.isArray(data.products)) {
          loadedProducts = data.products;
        } else {
          console.error("Unexpected response format:", data);
        }

        setProducts(loadedProducts);
        setFilteredProducts(loadedProducts);

        const uniqueCategories = [...new Set(loadedProducts.map((p) => p.category))];
        setCategories(uniqueCategories);

        toast.success("Products loaded successfully!", { autoClose: 1500 });
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products", { autoClose: 2000 });
      }
    };

    fetchProducts();

    // Load cart only inside useEffect
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterProducts(value, selectedCategory, sortOrder);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    filterProducts(searchTerm, value, sortOrder);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOrder(value);
    filterProducts(searchTerm, selectedCategory, value);
  };

  const filterProducts = (search: string, category: string, order: string) => {
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

    if (order === "asc") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (order === "desc") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  };

  const addToCart = (product: Product) => {
    console.log("Adding to cart:", product);
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
  
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          { ...product, quantity: 1 },
        ];
      }
  
      console.log("Updated cart:", updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.name} added to cart!`, { autoClose: 1200 });
      return updatedCart;
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-300 via-lime-200 to-yellow-300 p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-green-800">Product Catalog</h2>
        <button
          onClick={() => navigate("/cart")}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-full shadow-md hover:scale-105 transition"
        >
          View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 p-3 rounded-lg flex-grow shadow-sm focus:ring-2 focus:ring-green-400"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id} // ✅ added key
              className="border border-gray-200 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3"
              style={{ minHeight: "350px", maxWidth: "300px", margin: "auto" }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="flex flex-col items-center text-center space-y-1">
                <h3 className="text-xl font-extrabold text-green-800">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 px-2">{product.description}</p>
                <p className="text-green-700 font-bold text-lg mt-1">₹{product.price}</p>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="bg-green-100 px-2 py-1 rounded-full">
                    Stock: {product.stock}
                  </span>
                  <span className="bg-yellow-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-4 rounded-full shadow hover:scale-105 transition"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-700 font-semibold">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchProducts;
