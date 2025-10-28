import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const { login, user, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      if (user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show elegant loading state
  if (isLoading || (!isLoading && user)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-widest">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm tracking-wide">
            Sign in to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-200 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs tracking-widest uppercase text-gray-400">
              Email Address
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
              className="w-full bg-transparent border border-gray-700 px-4 py-4 focus:border-white transition-colors duration-300 outline-none text-white placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs tracking-widest uppercase text-gray-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                disabled={loading}
                className="text-xs text-gray-500 hover:text-white transition-colors duration-300 tracking-wider disabled:opacity-50"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="current-password"
                className="w-full bg-transparent border border-gray-700 px-4 py-4 pr-12 focus:border-white transition-colors duration-300 outline-none text-white placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-300 disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-white text-black py-4 overflow-hidden transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8"
          >
            <span className="relative z-10 text-sm tracking-widest font-medium flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </span>
            <div className="absolute inset-0 bg-gray-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 group-disabled:translate-y-full"></div>
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm tracking-widest font-medium z-20 group-disabled:opacity-0">
              Sign In
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-4 text-gray-500 tracking-widest">
                New to Cloudscpae?
              </span>
            </div>
          </div>

          {/* Create Account Link */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            disabled={loading}
            className="w-full border border-gray-700 text-white py-4 hover:bg-white hover:text-black transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <span className="text-sm tracking-widest font-medium">
              Create Account
            </span>
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => navigate("/help")}
            className="text-xs text-gray-600 hover:text-white transition-colors duration-300 tracking-wider"
          >
            Help
          </button>
          <button
            onClick={() => navigate("/privacy")}
            className="text-xs text-gray-600 hover:text-white transition-colors duration-300 tracking-wider"
          >
            Privacy
          </button>
          <button
            onClick={() => navigate("/terms")}
            className="text-xs text-gray-600 hover:text-white transition-colors duration-300 tracking-wider"
          >
            Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;