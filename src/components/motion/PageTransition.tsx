import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 12 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1] as const
    } 
  },
  exit: { 
    opacity: 0, 
    y: -12, 
    transition: { 
      duration: 0.24,
      ease: [0.4, 0, 0.2, 1] as const
    } 
  }
};

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  id, 
  className = "" 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};