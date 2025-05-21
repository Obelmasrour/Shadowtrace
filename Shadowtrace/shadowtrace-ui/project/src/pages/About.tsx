// ✅ About.tsx (back to original animated blue circle effect)
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Topbar from '../components/TopBar';

const About = ({ darkMode, setDarkMode }) => {
  useEffect(() => {
    document.title = 'About | ShadowTrace';
    const favicon = document.getElementById('favicon');
    if (favicon) favicon.setAttribute('href', '/favicon.ico');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Animated blurred blue circle background */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-blue-500 opacity-10 blur-3xl rounded-full pointer-events-none z-0"
        animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <main className="flex-grow pt-28 px-6 pb-12 relative z-10">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">About ShadowTrace</h1>
          <p className="text-gray-700 dark:text-blue-200 text-lg">
            ShadowTrace is an automated web security scanning platform based on OWASP ZAP.
            It helps identify critical vulnerabilities in your web applications quickly.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Goal</h2>
            <p className="text-gray-700 dark:text-blue-200">
              Provide a simple and intuitive tool to audit your applications without advanced technical skills.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">How It Works</h2>
            <p className="text-gray-700 dark:text-blue-200">
              The scan is based on the OWASP ZAP API, and results are displayed in an interactive table with PDF export.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Technologies</h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-blue-200">
              <li>React + TailwindCSS</li>
              <li>Node.js + Express</li>
              <li>OWASP ZAP</li>
              <li>PDFKit</li>
            </ul>
          </div>

          <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Security & Legality</h2>
            <p className="text-gray-700 dark:text-blue-200">
              Each scan is preceded by a DNS verification. You must own the domain to launch the audit.
            </p>
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

export default About;
