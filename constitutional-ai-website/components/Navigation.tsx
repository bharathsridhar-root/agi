import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Framework', href: '#framework' },
    { label: 'Scenarios', href: '#scenarios' },
    { label: 'Principles', href: '#principles' },
    { label: 'Defense', href: '#defense' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-700'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold gradient-text cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚖️ CAIGP
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            className="hidden sm:block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Launch Demo
          </motion.button>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              className="p-2 text-blue-400"
              whileTap={{ scale: 0.95 }}
            >
              ☰
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
