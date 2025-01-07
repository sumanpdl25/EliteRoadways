import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            const { data } = await axios.post('/api/v1/users/login', formData, {
                withCredentials: true,
            });

            // Use the response data (if any) from the backend
            toast.success(data.message || 'Login successful! Redirecting to home...', {
                position: 'top-right',
                autoClose: 3000,
            });

            // Navigate to /home after a short delay
            setTimeout(() => navigate('/home'), 3000);
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);

            toast.error(error.response?.data?.message || 'Login failed. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600 px-4">
            <h2 className="text-3xl font-bold text-white mb-6">Login to Your Account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm space-y-4 bg-white bg-opacity-70 p-6 rounded-xl shadow-lg">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Login
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
