// src/AppRouter.tsx
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';

import PageWrapper from './components/PageWrapper.tsx';
import ProgressBar from './components/ProgressBar.tsx';
import About from './pages/About.tsx';
import HomePage from './pages/HomePage.tsx';
import ScanPage from './pages/ScanPage.tsx';

const AppRouter = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialisation dark mode
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDarkMode(true);
  }, []);

  // Applique dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Progress bar déclenchée à chaque changement de route
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <ProgressBar isAnimating={loading} />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><HomePage darkMode={darkMode} setDarkMode={setDarkMode} /></PageWrapper>} />
          <Route path="/scan" element={<PageWrapper><ScanPage darkMode={darkMode} setDarkMode={setDarkMode} /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About darkMode={darkMode} setDarkMode={setDarkMode} /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AppRouter;
