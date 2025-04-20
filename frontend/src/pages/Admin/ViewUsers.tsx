import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
}

interface ViewUsersProps {
  setIsAdminAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewUsers: React.FC<ViewUsersProps> = ({ setIsAdminAuthenticated }) => {
  const [users, setUsers] = useState<User[]>([]); // Use User[] instead of any[]
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("https://freshcart-eqob.onrender.com/api/auth/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Admin logout handler
  const handleLogout = () => {
    setIsAdminAuthenticated(false);  // Update admin auth status
    localStorage.setItem("isAdminAuthenticated", "false");  // Persist in local storage
    navigate("/admin/signin");  // Redirect to admin login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-400 via-lime-400 to-yellow-500 p-4">
      <div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-3xl animate-fade-in-down">
        <h2 className="text-3xl font-extrabold text-green-900 mb-8 text-center">View Users</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border">{user.id}</td>
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white p-3 rounded-lg font-bold transition duration-300 ease-in-out hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ViewUsers;
