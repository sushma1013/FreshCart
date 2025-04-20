import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const SignIn = ({
  setIsUserAuthenticated,
}: { setIsUserAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isUserAuthenticated", "true");
        localStorage.setItem("userId", data.user.id);
        setIsUserAuthenticated(true);

        toast.success("Login Successful! 🌟");

        setTimeout(() => {
          navigate("/");
        }, 1500); // Give time for user to see success message
      } else {
        toast.error(data.message || "Login failed 😢");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! 🚨");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-300 via-lime-200 to-yellow-300 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      <form 
        onSubmit={handleSignIn}
        className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-down"
      >
        <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
          Welcome Back! 🌱
        </h2>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-green-800 text-green-900 font-medium transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/60 border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-green-800 text-green-900 font-medium transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="mt-6 text-center text-green-800 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-900 underline hover:text-green-700">
            Sign up here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
