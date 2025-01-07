import { useNavigate } from 'react-router-dom';

const First = () => {
  const navigate = useNavigate();

  const navigateToSignup = () => navigate('/signup');
  const navigateToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center dark:bg-gray-800 relative">
      <div className="text-center p-6 z-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bus Booking</h1>
        <p className="text-lg mb-8">The easiest way to book your bus tickets online.</p>

        <div className="flex gap-4">
          {/* Login Button */}
          <button
            onClick={navigateToLogin}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition duration-300"
          >
            Login
          </button>

          {/* Signup Button */}
          <button
            onClick={navigateToSignup}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition duration-300"
          >
            Signup
          </button>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-50 z-0"></div>
    </div>
  );
};

export default First;
