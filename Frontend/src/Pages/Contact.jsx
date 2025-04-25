import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import icons from Phosphor Icons React package
import { FacebookLogo, InstagramLogo, YoutubeLogo } from '@phosphor-icons/react';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#E1EACD] flex flex-col">
      {/* Header Section - Centered Text */}
      <header className="bg-[#E1EACD] text-[#2A004E] font-bold py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <h1 className="text-3xl">Contact</h1>
        </div>
      </header>

      <div className="flex justify-center items-center flex-1 bg-[#E1EACD]">
        <div className="bg-[#bad8b6] p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
          <div className="mb-6">
            <img
              src="/profile-picture.png"
              alt="User Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          </div>
          <div className="text-[#2A004E]">
            <h1 className="text-2xl font-bold mb-2">Sushil Adhikari</h1>
            <p className="text-lg mb-4">@sushil_adhikari87</p>

            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mb-6">
              <a
                href="https://www.facebook.com/sushil.adk.9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A004E] hover:text-[#4267B2] transition-colors flex items-center"
              >
                <FacebookLogo size={32} />
                <span className="ml-2">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/sushil_adhikari87/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A004E] hover:text-pink-500 transition-colors flex items-center"
              >
                <InstagramLogo size={32} />
                <span className="ml-2">Instagram</span>
              </a>
              <a
                href="https://youtube.com/@puranchourvlogs7930"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A004E] hover:text-red-600 transition-colors flex items-center"
              >
                <YoutubeLogo size={32} />
                <span className="ml-2">YouTube</span>
              </a>
            </div>

            {/* Contact Info */}
            <div className="text-left text-[#2A004E]">
              <div className="mb-2">
                <h2 className="font-semibold">Phone:</h2>
                <p className="ml-2">9814129965</p>
              </div>
              <div>
                <h3 className="font-semibold">Email:</h3>
                <p className="ml-2">adhikarisushil219@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mt-6 py-2 px-4 bg-[#8D77AB] text-white font-semibold rounded-lg w-full hover:bg-[#2A004E] transition-all"
          >
            Back
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center z-10 w-full">
        <p className="text-sm text-[#2A004E] font-light tracking-wide">
          © 2024 Elite Roadways. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Contact;