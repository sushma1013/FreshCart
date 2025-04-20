import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const AdminDashboard = () => {
  const handleActionClick = (action: string) => {
    toast.success(`Navigating to ${action} page! 🎉`);
  };

  return (
    <div
      className="p-6 min-h-screen bg-cover bg-center bg-gradient-to-tr from-green-100 via-lime-200 to-yellow-200"
      >
    
      <Toaster position="top-center" reverseOrder={false} />

      {/* Banner Section */}
      <div className="bg-gradient-to-r from-green-500 to-lime-600 text-white rounded-lg p-10 mb-10 shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome Admin!</h1>
        <p className="text-lg">
          Manage users, products, and orders efficiently from the Admin Dashboard.
        </p>
      </div>

      {/* Admin Action Cards */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-green-800">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/add-user"
          className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700 transition"
          onClick={() => handleActionClick("Add User")}
        >
          ➕ Add User
        </Link>

        <Link
          to="/admin/view-users"
          className="bg-lime-600 text-white p-6 rounded-lg text-center hover:bg-lime-700 transition"
          onClick={() => handleActionClick("View Users")}
        >
          👥 View Users
        </Link>

        <Link
          to="/admin/add-product"
          className="bg-yellow-600 text-white p-6 rounded-lg text-center hover:bg-yellow-700 transition"
          onClick={() => handleActionClick("Add Product")}
        >
          ➕ Add Product
        </Link>

        <Link
          to="/admin/view-products"
          className="bg-purple-600 text-white p-6 rounded-lg text-center hover:bg-purple-700 transition"
          onClick={() => handleActionClick("View Products")}
        >
          📦 View Products
        </Link>

        <Link
          to="/admin/view-orders"
          className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700 transition"
          onClick={() => handleActionClick("View Orders")}
        >
          🛒 View Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
