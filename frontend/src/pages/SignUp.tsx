import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle for password visibility
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password Strength Checker
  const checkPasswordStrength = (password: string) => {
    const strengthRegex = [
      /[a-z]/, // lower case
      /[A-Z]/, // upper case
      /[0-9]/, // number
      /[^a-zA-Z0-9]/, // special character
      /.{8,}/, // min length of 8
    ];
    
    const passed = strengthRegex.filter((regex) => regex.test(password)).length;
    const strengthLevels = ['Weak', 'Medium', 'Strong'];
    setPasswordStrength(strengthLevels[passed - 1] || 'Weak');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill out all fields. ⚠️");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://freshcart-eqob.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Something went wrong! ❌");
        return;
      }

      toast.success("Account created successfully! 🎉 Redirecting...");
      setTimeout(() => {
        // Auto-login after successful sign-up
        localStorage.setItem('isUserAuthenticated', 'true');
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again. 🚨');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 via-lime-200 to-yellow-200 p-6">
      <Toaster position="top-center" reverseOrder={false} />
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in-up"
      >
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
          Create Your Account 🌽
        </h2>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-green-700 text-green-900 font-medium transition"
            required
          />

          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
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

          <div className="mt-2 text-sm font-medium text-green-600">
            Password Strength: <span className={`text-${passwordStrength === 'Weak' ? 'red' : passwordStrength === 'Medium' ? 'yellow' : 'green'}-600`}>{passwordStrength}</span>
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
            "Sign Up"
          )}
        </button>

        <div className="mt-6 text-center text-green-800 font-medium">
          Already have an account?{" "}
          <Link to="/signin" className="text-green-900 underline hover:text-green-700">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
