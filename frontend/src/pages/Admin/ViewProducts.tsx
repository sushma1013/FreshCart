import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

interface Product {
  id: number; // Updated to `id` instead of `_id`
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string; // Updated to `image_url`
  category: string;
}

interface ViewProductsProps {
  setIsAdminAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewProducts: React.FC<ViewProductsProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://freshcart-eqob.onrender.com/api/products");
      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("Unexpected API response format:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://freshcart-eqob.onrender.com/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      fetchProducts(); // refresh the product list
    }catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error deleting product");
      } else {
        toast.error("Unknown error occurred");
      }
    }
    
  };

  const handleEdit = (productId: number) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">All Products</h2>
       
      </div>

      {loading ? (
        <div className="text-center text-lg flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
          <span>Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-lg">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id} // Use `id` as key instead of `_id`
              className="bg-white border rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 p-6"
            >
              <div className="relative">
                <img
                  src={product.image_url} // Use `image_url` instead of `imageUrl`
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(product.id)} // Pass `id` as number
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)} // Use `id` here as well
                    className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="font-bold mt-2 text-xl text-green-600">₹{product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
