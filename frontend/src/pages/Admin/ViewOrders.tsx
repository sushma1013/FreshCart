import React, { useState, useEffect } from "react";

interface ViewOrdersProps {
  setIsAdminAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define the type for individual items in an order
interface OrderItem {
  productName: string;
  quantity: number;
}

// Define the structure for an order
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

// Define the type for the raw order data fetched from the API
interface RawOrder {
  id: string;
  user_id: string;
  product_name: string;
  quantity: number;
  total_price: string;
  status: string;
  created_at: string;
}

const ViewOrders: React.FC<ViewOrdersProps> = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch the orders from the API and group them by orderId
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://freshcart-eqob.onrender.com/api/orders");

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: RawOrder[] = await response.json();

      // Group items by orderId
      const groupedOrders = data.reduce((acc: Order[], curr: RawOrder) => {
        const existingOrder = acc.find((order) => order.id === curr.id);
        if (existingOrder) {
          existingOrder.items.push({
            productName: curr.product_name,
            quantity: curr.quantity,
          });
        } else {
          acc.push({
            id: curr.id,
            userId: curr.user_id,
            totalAmount: parseFloat(curr.total_price),
            status: curr.status,
            createdAt: curr.created_at,
            items: [{
              productName: curr.product_name,
              quantity: curr.quantity,
            }],
          });
        }
        return acc;
      }, []);

      setOrders(groupedOrders);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle change in order status
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  // Update the status of an order
  const updateOrderStatus = async (orderId: string) => {
    try {
      const response = await fetch(`https://freshcart-eqob.onrender.com/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      alert("Order status updated successfully!");
      setUpdatingOrderId(null);
      fetchOrders();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error updating order status");
    }
  };

  // Get color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500 font-semibold";
      case "Shipped":
        return "text-blue-500 font-semibold";
      case "Delivered":
        return "text-green-500 font-semibold";
      case "Cancelled":
        return "text-red-500 font-semibold";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-lime-200 to-yellow-200 py-10">
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">View & Update Orders</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  {["Order ID", "User ID", "Items", "Total Amount", "Status", "Created At", "Actions"].map((heading) => (
                    <th key={heading} className="px-6 py-3 text-left text-gray-700 font-semibold uppercase text-sm border-b">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.userId}</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.productName} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">₹{order.totalAmount.toFixed(2)}</td>
                    <td className={`px-6 py-4 ${getStatusColor(order.status)}`}>{order.status}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {updatingOrderId === order.id ? (
                        <div className="flex flex-col space-y-2">
                          <select
                            value={newStatus}
                            onChange={handleStatusChange}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateOrderStatus(order.id)}
                              className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-md font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setUpdatingOrderId(null)}
                              className="bg-gray-400 hover:bg-gray-500 transition text-white px-4 py-2 rounded-md font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setUpdatingOrderId(order.id);
                            setNewStatus(order.status);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-md font-semibold"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;
