import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Framework() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      name: 'Constitutional Principles',
      icon: '⚖️',
      description: 'Five foundational principles that all systems must follow',
      details: ['Transparency', 'Containment', 'Human Authority', 'Coordination', 'Safe Failure'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Grassroots Certification',
      icon: '✓',
      description: 'Organizations self-assess and get independently audited',
      details: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Policy Templates',
      icon: '📋',
      description: 'Modular regulatory frameworks for different domains',
      details: ['Manufacturing', 'Finance', 'Healthcare', 'Infrastructure'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Compliance Tracking',
      icon: '📊',
      description: 'Real-time monitoring and incident reporting',
      details: ['System Registry', 'Incident Database', 'Audit Logs', 'Monitoring'],
      color: 'from-orange-500 to-red-500',
    },
  ];

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
    <section id="framework" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="gradient-text">Governance Framework</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Six layered defenses that work together to prevent uncontrolled AI development
          </motion.p>
        </motion.div>

        {/* Layers visualization */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {layers.map((layer, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-lg border border-slate-700 cursor-pointer transition-all duration-300 card-hover ${
                activeLayer === index ? 'bg-slate-700/50' : 'bg-slate-800/30 hover:bg-slate-700/30'
              }`}
              onClick={() => setActiveLayer(index)}
            >
              <div className={`text-5xl mb-4 transform transition-transform duration-300 ${activeLayer === index ? 'scale-110' : ''}`}>
                {layer.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{layer.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{layer.description}</p>
              {activeLayer === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-slate-700"
                >
                  <div className="flex flex-wrap gap-2">
                    {layer.details.map((detail, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${layer.color} bg-opacity-20 text-white`}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 animated-border"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Defense in Depth Architecture</h3>
          <div className="space-y-4">
            {[
              { title: 'Layer 1', desc: 'Distributed Authority - Byzantine Fault Tolerance' },
              { title: 'Layer 2', desc: 'Transparency & Public Auditability' },
              { title: 'Layer 3', desc: 'Decentralized Incident Reporting' },
              { title: 'Layer 4', desc: 'Cryptographic Verification' },
              { title: 'Layer 5', desc: 'International Treaty Framework' },
              { title: 'Layer 6', desc: 'Continuous Monitoring' },
            ].map((layer, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                whileHover={{ x: 10 }}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-bold text-white">{layer.title}</div>
                  <div className="text-slate-400 text-sm">{layer.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
