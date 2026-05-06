import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const CompleteAnimation = ({ 
  onComplete,
  children 
}: { 
  onComplete: () => void;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stars = Array(8).fill(0); // Reduced number for better performance

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 800); // Shorter duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      style={{
        background: 'rgba(254, 240, 138, 0.3)', 
      }}
    >
      {/* Dark mode support */}
      <div className="absolute inset-0 dark:bg-amber-900/30" />
      
      <div className="opacity-70">
        {children}
      </div>
      
      {/* Falling stars */}
      {stars.map((_, i) => {
        const startX = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const size = Math.random() * 12 + 8;
        const duration = Math.random() * 0.5 + 0.5;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              y: -20,
              x: `${startX}%`,
              scale: 0.5
            }}
            animate={{ 
              opacity: [0, 0.8, 0],
              y: "100%",
              rotate: Math.random() * 360,
              scale: 1
            }}
            transition={{
              duration,
              delay,
              ease: "easeOut",
            }}
            className="absolute text-amber-400"
            style={{ 
              top: -10,
              width: `${size}px`,
              height: `${size}px`,
              filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.8))'
            }}
          >
            <Star className="w-full h-full" />
          </motion.div>
        );
      })}
    </div>
  );
};