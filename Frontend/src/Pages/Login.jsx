import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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

        try {
            const { data } = await axios.post('/api/v1/users/login', formData);

            if (data.success) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                
                // Store user data if needed
                localStorage.setItem('user', JSON.stringify(data.user));

                toast.success('Login successful! Redirecting...', {
                    position: 'top-right',
                    autoClose: 2000,
                });

                // Navigate to home after a short delay
                setTimeout(() => navigate('/home'), 2000);
            } else {
                toast.error(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center dark:bg-gray-800 relative overflow-hidden">
        
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-0 left-0 w-full h-full z-0"
            >
                <img 
                    src="/bus6.png" 
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
                        Welcome Back
                    </span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-xl mb-8 text-white drop-shadow-md font-light tracking-wide"
                >
                    Login to your Elite Roadways account
                </motion.p>

                <motion.form 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    onSubmit={handleSubmit} 
                    className="flex flex-col w-full max-w-sm space-y-5 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20"
                >
                    <div className="space-y-2">
                        <label className="text-left block text-sm font-medium text-white/80 tracking-wide">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-left block text-sm font-medium text-white/80 tracking-wide">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white font-medium transition duration-300 shadow-lg text-lg tracking-wide"
                    >
                        Login
                    </motion.button>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-sm text-white/70 mt-4"
                    >
                        Don&apos;t have an account?{' '}
                        <motion.span 
                            whileHover={{ color: "rgba(59, 130, 246, 1)" }}
                            onClick={() => navigate('/signup')}
                            className="text-blue-400 cursor-pointer hover:underline"
                        >
                            Sign up
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
}

export default Login;
