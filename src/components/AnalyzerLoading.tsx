import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnalyzerLoadingProps {
  isOpen: boolean;
  onComplete: () => void;
  duration?: number; // Duration in ms, default will be random between 900-1200
}

const ChairIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
    <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5z" />
    <path d="M5 18v2" />
    <path d="M19 18v2" />
  </svg>
);

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { 
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1] as const
    }
  },
  exit: { 
    opacity: 0, 
    transition: { 
      duration: 0.24,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

const contentVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: -8,
    transition: { 
      duration: 0.24,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

const iconVariants = {
  animate: {
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

export const AnalyzerLoading: React.FC<AnalyzerLoadingProps> = ({
  isOpen,
  onComplete,
  duration
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingDuration] = useState(() => 
    duration || Math.floor(Math.random() * 301) + 900 // 900-1200ms random
  );

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / loadingDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 200); // Small delay before completing
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isOpen, loadingDuration, onComplete]);

  // Handle keyboard interactions
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Prevent closing during loading for better UX
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const reducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-white/80 backdrop-blur-[1.5px]"
            style={{ backdropFilter: 'blur(1.5px)' }}
          />
          
          {/* Content */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-card p-8 mx-4 max-w-sm w-full text-center"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="text-[#D4AF37]"
                variants={reducedMotion ? {} : iconVariants}
                animate={reducedMotion ? {} : "animate"}
              >
                <ChairIcon className="w-12 h-12" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-foreground mb-2">
              Analisando suas medidas e perfil…
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm text-muted-foreground mb-8">
              Encontrando as melhores opções para você
            </p>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="w-full bg-[#F7F7F7] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4E4A6] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ 
                    duration: reducedMotion ? 0 : 0.18, 
                    ease: [0.4, 0, 0.2, 1] 
                  }}
                />
              </div>
              
              {/* Progress text */}
              <motion.p 
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(progress)}% concluído
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};