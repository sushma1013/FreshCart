import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const AdminSignIn = ({ setIsAdminAuthenticated }: { setIsAdminAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [username, setUsername] = useState('admin'); // Default value "admin"
  const [password, setPassword] = useState('admin'); // Default value "admin"
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle for password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      setIsAdminAuthenticated(true);
      toast.success("Successfully logged in as Admin! 🎉 Redirecting...");
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } else {
      setError('Invalid admin credentials.');
      toast.error('Invalid admin credentials. ❌');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 via-lime-200 to-yellow-200 p-6">
      <Toaster position="top-center" reverseOrder={false} />

      <form
        onSubmit={handleAdminLogin}
        className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in-up"
      >
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
          Admin Sign In 🔐
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />

          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="mt-6 text-center text-green-800 font-medium">
          Not an Admin?{' '}
          <Link to="/signin" className="text-green-900 underline hover:text-green-700">
            User Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminSignIn;
