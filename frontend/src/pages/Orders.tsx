import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Order {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
  product_name: string;
  image_url: string;
}

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        toast.info("Loading orders...");
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User not logged in");
          return;
        }

        const response = await axios.get(`https://freshcart-eqob.onrender.com/api/orders/user/${userId}`);
        setOrders(response.data);
        toast.dismiss();
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-green-300 via-lime-200 to-yellow-300">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders by product name"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                <span
                  className={`text-sm ${
                    order.status === "delivered" ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex mb-4">
                <img
                  src={order.image_url}
                  alt={order.product_name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h2>Name: <span>{order.product_name}</span></h2>
                      <h2>Quantity: <span>{order.quantity}</span></h2>
                    </div>
                    <span>₹{order.total_price}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold">₹{order.total_price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;