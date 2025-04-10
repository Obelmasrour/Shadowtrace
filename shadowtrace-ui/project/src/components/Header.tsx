import React from 'react';
import logo from '../assets/logo_shadow_trace.png';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 mr-3 relative">
              <img
                src={logo}
                alt="ShadowTrace logo"
                className="h-full w-full object-contain"
                style={{
                  filter: 'drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.7))',
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ShadowTrace</h1>
              <p className="text-blue-200">Web Security Scanner</p>
            </div>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-blue-200 transition-colors">Dashboard</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-blue-200 transition-colors">Documentation</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-blue-200 transition-colors">About</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
