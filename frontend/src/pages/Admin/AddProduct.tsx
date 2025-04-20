import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

interface AddProductProps {
  setIsAdminAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProduct: React.FC<AddProductProps> = ({ setIsAdminAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.setItem("isAdminAuthenticated", "false");
    navigate("/admin/signin");
  };

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
      const response = await fetch("https://freshcart-eqob.onrender.com/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      toast.success("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        category: "",
      });
    }catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error adding product");
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-400 via-lime-400 to-yellow-500 p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in-down">
        <h2 className="text-3xl font-extrabold text-green-900 mb-8 text-center">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Product Name", name: "name", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Price (in ₹)", name: "price", type: "number" },
            { label: "Stock Quantity", name: "stock", type: "number" },
            { label: "Image URL", name: "imageUrl", type: "text" },
            { label: "Category", name: "category", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-lg font-medium text-gray-800">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-gray-600"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-gray-600"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-bold transition duration-300 ease-in-out hover:bg-blue-700"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Add Product"
            )}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white p-3 rounded-lg w-full font-bold transition duration-300 ease-in-out hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
