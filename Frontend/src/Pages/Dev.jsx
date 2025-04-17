import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dev = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/profile.png"
          alt="Dev Background"
          className="w-full h-full object-cover opacity-40"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-4 tracking-tight"
        >
          Meet the Developer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl font-light leading-relaxed text-white/80 mb-8"
        >
          Hey! I'm <span className="text-green-400 font-semibold">Sandesh Pokhrel</span>, a developer passionate about web technologies, user experience, and performance optimization. I love crafting premium digital experiences using modern frameworks like React, Tailwind, and Node.js. Currently on a mission to empower developers and creators through my projects and content.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="https://pokhrelsandesh.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md font-medium text-white shadow-lg transition duration-300"
          >
            Visit Portfolio
          </a>
          <a
            href="https://github.com/pokhrelsandesh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-md font-medium text-white shadow-lg transition duration-300"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/sandeshpokhrel/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-md font-medium text-white shadow-lg transition duration-300"
          >
            LinkedIn
          </a>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-md text-white font-medium transition duration-300 shadow-lg"
        >
          Back to Home
        </motion.button>
      </div>
    </div>
  );
};

export default Dev;
