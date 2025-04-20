import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

interface EditProductsProps {
  setIsAdminAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProducts: React.FC<EditProductsProps> = ({ setIsAdminAuthenticated }) => {
  const { productId } = useParams<{ productId: string }>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image_url: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        const data = await response.json();

        if (response.ok) {
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            image_url: data.image_url,
            category: data.category,
          });
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        toast.error("Error fetching product details");
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      navigate("/admin/view-products");
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 via-lime-200 to-yellow-200 p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <form 
        onSubmit={handleSubmit} 
        className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-2xl animate-fade-in-up"
      >
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
          Edit Product ✨
        </h2>

        <div className="space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Product Price"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Available Stock"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />

          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
          />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Update Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProducts;
