// ✅ HomePage.tsx (with animations, graphic background, dynamic favicon and title)
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/TopBar';

const HomePage = ({ darkMode, setDarkMode }) => {
  useEffect(() => {
    document.title = 'Home | ShadowTrace';
    const favicon = document.getElementById('favicon');
    if (favicon) favicon.setAttribute('href', '/favicon.ico');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* === Subtle graphic background === */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-500 opacity-10 blur-3xl rounded-full pointer-events-none z-0" />

      {/* === Content === */}
      <header className="text-center pt-28 pb-10 relative z-10">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-2">ShadowTrace</h1>
          <p className="text-gray-600 dark:text-blue-200 text-lg">
            The smart solution to audit the security of your websites.
          </p>
        </motion.div>
      </header>

      <main className="flex-grow relative z-10">
        <section className="container mx-auto px-4 text-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Analyze the security flaws of your web applications
            </h2>
            <p className="text-gray-700 dark:text-blue-200 text-lg max-w-2xl mx-auto mb-10">
              ShadowTrace detects vulnerabilities like XSS, SQLi, CSRF, insecure cookies, and more.
            </p>
            <div className="flex justify-center">
              <Link to="/scan">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition">
                  Start a scan
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: '+100',
                text: 'Security tests (XSS, SQLi, CSRF...)',
              },
              {
                title: 'DNS Key',
                text: 'DNS verification required before each scan',
              },
              {
                title: 'PDF Report',
                text: 'Download a full report after analysis',
              },
            ].map((block, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="bg-gray-100 dark:bg-white/5 p-6 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
              >
                <h3 className="text-2xl font-bold mb-2">{block.title}</h3>
                <p className="text-gray-700 dark:text-blue-200">{block.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-6 mt-10 relative z-10">
        <div className="text-center text-sm text-gray-400">
          ShadowTrace © 2025 — Powered by OWASP ZAP
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
