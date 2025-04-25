import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Features = () => {
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
            <h1 className="text-4xl font-bold mb-4">Our Features</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover what makes Elite Roadways the best choice for your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl"
              >
                <div className={`p-3 ${feature.bgColor} rounded-lg w-fit mb-4`}>
                  <div className={`w-6 h-6 ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
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

const FeatureIcon = ({ children }) => (
  <div className="w-6 h-6">
    {children}
  </div>
);

const features = [
  {
    title: 'Easy Booking',
    description: 'Book your bus tickets in just a few clicks with our user-friendly interface.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-500/20',
    iconColor: 'text-blue-400'
  },
  {
    title: '24/7 Support',
    description: 'Our customer service team is available round the clock to assist you.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-green-500/20',
    iconColor: 'text-green-400'
  },
  {
    title: 'Secure Payments',
    description: 'Multiple secure payment options for your convenience and safety.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    bgColor: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
];

export default Features;