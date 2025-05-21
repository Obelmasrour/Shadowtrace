// src/components/PageWrapper.tsx
import { motion } from 'framer-motion';
import React from 'react';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-grow"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
