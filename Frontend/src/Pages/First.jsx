import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const First = () => {
  const navigate = useNavigate();

  const navigateToSignup = () => navigate('/signup');
  const navigateToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-[#E1EACD] flex flex-col relative">
      {/* Header/Navigation */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#E1EACD] text-[#2A004E] font-bold shadow-md"
      >
        <div className="header-container flex items-center justify-between w-full px-6 py-3 m-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="logo"
          >
            <img src="/logo.png" alt="Logo" className="max-w-[100px]" />
          </motion.div>
          <nav className="nav-links flex space-x-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/about" 
                className="text-[#8D77AB] text-xl transition-all duration-200 ease-in-out hover:text-[#2A004E] hover:border-b-2 hover:border-[#2A004E]"
              >
                About
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to="/features" 
                className="text-[#8D77AB] text-xl transition-all duration-200 ease-in-out hover:text-[#2A004E] hover:border-b-2 hover:border-[#2A004E]"
              >
                Features
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to="/contact" 
                className="text-[#8D77AB] text-xl transition-all duration-200 ease-in-out hover:text-[#2A004E] hover:border-b-2 hover:border-[#2A004E]"
              >
                Contact
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center bg-[#E1EACD]">
        <div className="max-w-7xl mx-auto px-6 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-8 text-[#2A004E]"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-5xl font-extrabold text-left"
              >
                Reclaim your time
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-xl font-bold text-left"
              >
                Book bus tickets online in just a few clicks
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex gap-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigateToSignup}
                  className="cta-button py-3 px-6 rounded-full text-xl font-semibold text-[#8D77AB] border-2 border-[#8D77AB] transition-all duration-200 ease-in-out hover:bg-[#2A004E] hover:border-[#2A004E] hover:text-white shadow-lg"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigateToLogin}
                  className="cta-button py-3 px-6 rounded-full text-xl font-semibold text-[#8D77AB] border-2 border-[#8D77AB] transition-all duration-200 ease-in-out hover:bg-[#2A004E] hover:border-[#2A004E] hover:text-white shadow-lg"
                >
                  Login
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="image-content flex-1 overflow-hidden relative"
            >
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.15 }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
                src="/home-image.png"
                alt="Home Image"
                className="w-[200%] h-auto rounded-lg object-cover shadow-xl transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="py-6 text-center z-10"
      >
        <p className="text-sm text-[#2A004E] font-light tracking-wide">
          © 2024 Elite Roadways. All Rights Reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default First;
