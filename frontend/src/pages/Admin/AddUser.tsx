import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

interface AddUserProps {
  setIsAdminAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>; // Optional prop
}

const AddUser: React.FC<AddUserProps> = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const newUser = { username, email, password };

    try {
      const response = await fetch("https://freshcart-eqob.onrender.com/api/auth/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("User added successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        toast.success("User added successfully!");
      } else {
        setError(data.message || "Failed to add user");
        toast.error(data.message || "Failed to add user");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-400 via-lime-400 to-yellow-500 p-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-down">
        <h2 className="text-3xl font-extrabold text-green-900 mb-8 text-center">
          Add New User
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-800">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full mt-2 p-3 bg-white/60 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 placeholder-gray-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 p-3 bg-white/60 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 placeholder-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 p-3 bg-white/60 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 placeholder-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Add User"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
