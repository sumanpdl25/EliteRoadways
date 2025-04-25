import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-[#E1EACD] text-[#2A004E] font-bold">
    <div className="header-container flex items-center justify-between w-full px-6 py-3 m-0">
      <div className="logo">
        <img src="/logo.png" alt="Logo" className="max-w-[80px]" />
      </div>
      <nav className="nav-links flex space-x-6">
        <Link
          to="/about"
          className="text-[#8D77AB] text-xl transition-all duration-200 ease-in-out hover:text-[#2A004E] hover:border-b-2 hover:border-[#2A004E]"
        >
          About
        </Link>
        <Link
          to="/features"
          className="text-[#8D77AB] text-xl transition-all duration-200 ease-in-out hover:text-[#2A004E] hover:border-b-2 hover:border-[#2A004E]"
        >
          Features
        </Link>
        <Link
          to="/contact"
          className="text-[#8D77AB] text-xl transition-all duration-200 ease-in-out hover:text-[#2A004E] hover:border-b-2 hover:border-[#2A004E]"
        >
          Contact
        </Link>
        <Link
  to="/login"
  className="text-[#8D77AB] text-xl transition-all duration-200 ease-in-out hover:text-[#2A004E] hover:border-b-2 hover:border-[#2A004E] block"
>
  Login
</Link>

      </nav>
    </div>
  </header>
);

export default Header;