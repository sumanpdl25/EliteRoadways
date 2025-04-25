import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
              Elite Roadways
            </span>
          </Link>
          <nav className="flex space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors duration-200">
              Home
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About Elite Roadways</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Your trusted partner in comfortable and reliable bus travel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-white/80">
                To provide convenient, reliable, and comfortable bus travel experiences 
                through innovative technology and exceptional customer service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-white/80">
                To become the leading online bus booking platform, revolutionizing 
                the way people travel and connect across destinations.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-white/80">
                  We prioritize our customers' needs and satisfaction above all else.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-white/80">
                  We continuously improve our services through technological advancement.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reliability</h3>
                <p className="text-white/80">
                  We ensure dependable service and maintain high standards of quality.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
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
    </div>
  );
};

export default About;