import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function CTA() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          ref={ref}
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Main CTA */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Build Safe AI?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Constitutional AI isn't a limitation on progress. It's the infrastructure for safe, coordinated AI development at scale.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.a
              href="https://github.com/bharathsridhar-root/agi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore on GitHub
            </motion.a>
            <motion.button
              className="px-8 py-4 bg-slate-700/50 text-white border border-slate-600 rounded-lg font-bold text-lg hover:bg-slate-600/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Framework
            </motion.button>
          </motion.div>

          {/* Info cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {[
              {
                icon: '📚',
                title: 'Complete Documentation',
                description: 'Governance frameworks, policy templates, and implementation guides',
              },
              {
                icon: '🧪',
                title: 'Interactive Scenarios',
                description: 'See how Constitutional AI prevents infrastructure cascades in real-time',
              },
              {
                icon: '🔗',
                title: 'Open Collaboration',
                description: 'Join the community of researchers, auditors, and policymakers',
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-slate-800/30 border border-slate-700 rounded-lg card-hover"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid md:grid-cols-4 gap-4 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {[
              { number: '5', label: 'Core Principles' },
              { number: '6', label: 'Defense Layers' },
              { number: '3+', label: 'Scenarios' },
              { number: '4', label: 'Governance Tiers' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer message */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900/50 border border-slate-700 rounded-lg p-8"
          >
            <p className="text-slate-400 mb-4">
              Constitutional AI is more than a safety framework. It's a governance system that makes it economical, practical, and enforceable to build safe AI systems at scale.
            </p>
            <p className="text-blue-400 font-semibold">
              The cost of preventing cascading failures is far lower than managing them after they happen.
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 pt-8 border-t border-slate-700 text-center"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <p className="text-slate-500 text-sm mb-4">
            Built with transparency and coordination in mind
          </p>
          <div className="flex justify-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Research</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Community</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
          <p className="text-slate-600 text-xs mt-6">
            © 2024 Constitutional AI Governance Platform. Open source, open standards, open future.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
