import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParallaxScroll from '@/components/ParallaxScroll';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <ParallaxScroll>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x * 0.5,
            y: -mousePosition.y * 0.5,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm font-medium">
              🚀 Next Generation AI Governance
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">Constitutional AI</span>
            <br />
            <span className="text-slate-300">Governance Platform</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            A transparent, distributed framework for safe, coordinated AI development. Watch how Constitutional AI prevents cascading infrastructure failures.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('scenarios')?.scrollIntoView()}
            >
              Explore Scenarios
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-slate-700/50 text-white border border-slate-600 rounded-lg font-bold text-lg hover:bg-slate-600/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Documentation
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center gap-2"
          >
            <div className="text-slate-400 text-sm">Scroll to explore</div>
            <svg className="w-5 h-5 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Floating cards preview */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        />
      </section>
    </ParallaxScroll>
  );
}
