import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // Default role is 'user'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/users/signup", formData);

      if (response.status === 201) {
        // Save token and user data in cookies
        const { token, user } = response.data;
        
        // Set token cookie with expiration of 7 days
        Cookies.set("token", token, { expires: 7 });
        
        // Set user data cookie
        Cookies.set("user", JSON.stringify(user), { expires: 7 });
        
        // Set axios default authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        toast.success("Signup successful! Redirecting to home...");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center dark:bg-gray-800 relative overflow-hidden">
      {/* Bus Image */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <img 
          src="/bus7.png" 
          alt="Bus" 
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      <div className="text-center p-6 z-10 relative">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 10,
            duration: 1 
          }}
          className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
            Elite Roadways
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl mb-8 text-white drop-shadow-md font-light tracking-wide"
        >
          Create your account and start booking
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-sm space-y-5 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20"
        >
          <div className="space-y-2">
            <label className="text-left block text-sm font-medium text-white/80 tracking-wide">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-left block text-sm font-medium text-white/80 tracking-wide">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-left block text-sm font-medium text-white/80 tracking-wide">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-left block text-sm font-medium text-white/80 tracking-wide">Role</label>
            <div className="flex items-center space-x-6 text-white/90">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="user"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                  className="mr-2 accent-blue-500"
                />
                <span>User</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                  className="mr-2 accent-blue-500"
                />
                <span>Admin</span>
              </label>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white font-medium transition duration-300 shadow-lg text-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-sm text-white/70 mt-4"
          >
            Already have an account?{' '}
            <motion.span 
              whileHover={{ color: "rgba(59, 130, 246, 1)" }}
              onClick={() => navigate('/login')}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
            </motion.span>
          </motion.p>
        </motion.form>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 text-center z-10 w-full"
      >
        <p className="text-sm text-white/70 font-light tracking-wide">
          © 2024 Elite Roadways. All Rights Reserved.
        </p>
      </motion.footer>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80 z-0"></div>
      
      <ToastContainer />
    </div>
  );
};

export default Signup;
