import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const First = () => {
  const navigate = useNavigate();

  const navigateToSignup = () => navigate('/signup');
  const navigateToLogin = () => navigate('/login');
  const navigateToDevInfo = () => navigate('/devinfo');

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
          src="/bus5.png" 
          alt="Bus" 
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      {/* Developer Info Button - Top Right */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute top-6 right-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={navigateToDevInfo}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-md text-white font-medium transition duration-300 shadow-lg text-sm tracking-wide"
        >
          Developer's Info
        </motion.button>
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
          className="text-6xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
            Welcome to
          </span>
          <br />
          <span className="text-7xl font-black tracking-wider">
            Chill BUSES
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl mb-12 text-white drop-shadow-md font-light tracking-wide"
        >
          The premium way to book your bus tickets online.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex gap-6 justify-center"
        >
          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateToLogin}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white font-medium transition duration-300 shadow-lg text-lg tracking-wide"
          >
            Login
          </motion.button>

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateToSignup}
            className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg text-white font-medium transition duration-300 shadow-lg text-lg tracking-wide"
          >
            Signup
          </motion.button>
        </motion.div>
      </div>

      {/* Copyright Notice */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 text-center z-10"
      >
        <p className="text-sm text-white/70 font-light tracking-wide">
          © 1914 Chill. All Rights Reserved.
        </p>
      </motion.div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80 z-0"></div>
    </div>
  );
};

export default First;
