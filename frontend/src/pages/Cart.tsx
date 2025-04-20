import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";

interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "address") setAddress(value);
    if (name === "phone") setPhone(value);
    if (name === "email") setEmail(value);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDeleteItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart!");
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !phone || !email) {
      toast.error("Please fill in all the fields!");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not logged in. Please log in to place an order.");
      return;
    }

    const orderData = {
      userId,
      name,
      address,
      phone,
      email,
      cartItems,
      totalAmount: calculateTotalPrice(),
      products: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await fetch("https://freshcart-eqob.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        localStorage.removeItem("cart");
        setCartItems([]);
        setOrderSubmitted(true);
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to store order. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting order!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen bg-gradient-to-tr from-green-300 via-lime-200 to-yellow-300">
      <Toaster position="top-center" reverseOrder={false} />

      {orderSubmitted ? (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Order Submitted 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. We will contact you soon!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Back to Products
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">🛒 Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty!</p>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h4 className="font-semibold text-lg text-gray-700">{item.name}</h4>
                        <p className="text-gray-500 text-sm">₹{item.price} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, +e.target.value)}
                        className="w-16 border-gray-300 border rounded-md p-2 text-center"
                      />
                      <p className="font-bold text-green-700">₹{item.price * item.quantity}</p>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-red-500 hover:text-red-700 text-2xl"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8 bg-green-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800">Total:</h3>
                <p className="text-xl font-bold text-green-700">₹{calculateTotalPrice()}</p>
              </div>
            </>
          )}

          {/* Order Form */}
          {cartItems.length > 0 && (
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Delivery Information</h3>
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Address</label>
                  <textarea
                    name="address"
                    value={address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none"
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
  <button
    type="button"
    onClick={() => navigate("/products")}
    className="w-full md:w-auto bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition"
  >
    Back to Products
  </button>

  <button
    type="submit"
    className="w-full md:w-auto bg-green-600 text-white py-2 px-8 rounded-md hover:bg-green-700 transition"
  >
    Place Order
  </button>
</div>

              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
