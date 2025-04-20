import { useState, useEffect, JSX } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Orders from './pages/Orders';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminSignIn from "./pages/Admin/AdminSignIn";
import AddUser from "./pages/Admin/AddUser";
import ViewUsers from "./pages/Admin/ViewUsers";
import Navbar from './components/Navbar';
import ViewOrders from "./pages/Admin/ViewOrders";
import AddProduct from "./pages/Admin/AddProduct";
import ViewProducts from "./pages/Admin/ViewProducts";
import EditProduct from "./pages/Admin/EditProducts";
import Cart from "./pages/Cart";
import BulkOrderPage from "./pages/BulkOrder";
import Footer from "./pages/Footer";

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const userAuthStatus = localStorage.getItem("isUserAuthenticated") === "true";
    const adminAuthStatus = localStorage.getItem("isAdminAuthenticated") === "true";
    setIsUserAuthenticated(userAuthStatus);
    setIsAdminAuthenticated(adminAuthStatus);
  }, []);

  const UserProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isUserAuthenticated ? children : <Navigate to="/signin" />;
  };

  const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAdminAuthenticated ? children : <Navigate to="/admin/signin" />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        isUserAuthenticated={isUserAuthenticated}
        isAdminAuthenticated={isAdminAuthenticated}
        setIsUserAuthenticated={setIsUserAuthenticated}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn setIsUserAuthenticated={setIsUserAuthenticated} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/signin" element={<AdminSignIn setIsAdminAuthenticated={setIsAdminAuthenticated} />} />

        {/* User Protected Routes */}
        <Route
          path="/products"
          element={
            <UserProtectedRoute>
              <Products  />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <UserProtectedRoute>
              <Cart />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <UserProtectedRoute>
              <Orders />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/bulk-orders"
          element={
            <UserProtectedRoute>
              <BulkOrderPage />
            </UserProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <AdminProtectedRoute>
              <AddUser setIsAdminAuthenticated={setIsAdminAuthenticated} />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/view-users"
          element={
            <AdminProtectedRoute>
              <ViewUsers setIsAdminAuthenticated={setIsAdminAuthenticated} />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/view-orders"
          element={
            <AdminProtectedRoute>
              <ViewOrders setIsAdminAuthenticated={setIsAdminAuthenticated} />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminProtectedRoute>
              <AddProduct setIsAdminAuthenticated={setIsAdminAuthenticated} />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/view-products"
          element={
            <AdminProtectedRoute>
              <ViewProducts setIsAdminAuthenticated={setIsAdminAuthenticated} />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminProtectedRoute>
              <EditProduct setIsAdminAuthenticated={setIsAdminAuthenticated} />
            </AdminProtectedRoute>
          }
        />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
