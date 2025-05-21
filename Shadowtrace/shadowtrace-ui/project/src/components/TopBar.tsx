// src/components/Topbar.tsx
import { Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Topbar = ({ darkMode, setDarkMode }) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-950 dark:bg-blue-900 shadow fixed top-0 w-full z-50">
      <div className="flex items-center gap-3">
        <img src="/favicon.ico" alt="logo" className="w-6 h-6" />
        <span className="text-white font-bold">ShadowTrace</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-white text-sm hover:underline">Home</Link>
        <Link to="/scan" className="text-white text-sm hover:underline">Scanner</Link>
        <Link to="/about" className="text-white text-sm hover:underline">About</Link>
        <button
          onClick={() => {
            setDarkMode(!darkMode);
            toast(`${!darkMode ? "🌙 Dark mode enabled" : "☀️ Light mode enabled"}`);
          }}
          className="text-white hover:text-blue-300 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Topbar;
