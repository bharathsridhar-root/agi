import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Principles() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const principles = [
    {
      title: 'Transparency & Interpretability',
      icon: '👁️',
      description: 'AI decisions must be explainable to humans in the domain',
      details: [
        'Decision chains are auditable',
        'Factors and weights are visible',
        'Non-technical auditors can understand reasoning',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Containment & Isolation',
      icon: '🔒',
      description: 'AI systems cannot autonomously act across critical infrastructure',
      details: [
        'Each system operates in defined domain',
        'Cross-domain actions require human approval',
        'Physical/architectural separation enforced',
      ],
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Human Authority & Override',
      icon: '👤',
      description: 'Humans retain decision authority over critical outcomes',
      details: [
        'Kill switches always work',
        'Veto points at critical junctures',
        'AI recommends, human approves',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Coordination & Disclosure',
      icon: '🤝',
      description: 'Systems must coordinate on safety standards and vulnerabilities',
      details: [
        'Mandatory disclosure to trusted intermediary',
        'Shared vulnerability database',
        'Coordinated patching and response',
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Safe Failure & Degradation',
      icon: '🛡️',
      description: 'Systems fail safely when attacked or corrupted',
      details: [
        'Automatic isolation on anomaly detection',
        'Graceful degradation to human control',
        'Redundancy and backup systems',
      ],
      color: 'from-indigo-500 to-violet-500',
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
    <section id="principles" className="relative py-24 overflow-hidden">
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
            <span className="gradient-text">Five Core Principles</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            The foundational values that every system must follow
          </motion.p>
        </motion.div>

        {/* Principles grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
              whileHover={{ scale: 1.05 }}
            >
              {/* Card background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card content */}
              <div className={`relative p-8 rounded-lg border border-slate-700 bg-slate-800/30 group-hover:bg-slate-800/50 transition-all duration-300 h-full`}>
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className={`text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                    {principle.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${principle.color} bg-clip-text text-transparent`}>
                    {principle.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4">{principle.description}</p>

                  {/* Details */}
                  <ul className="space-y-2 mt-auto">
                    {principle.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        className="text-sm text-slate-300 flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className={`text-${principle.color} mt-1 flex-shrink-0`}>✓</span>
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${principle.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How they work together */}
        <motion.div
          className="mt-20 bg-slate-800/30 rounded-lg p-8 border border-slate-700 animated-border"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">How They Work Together</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { num: 1, text: 'Transparency\nreveals', icon: '👁️' },
              { num: 2, text: 'Vulnerabilities\nwhich', icon: '🔍' },
              { num: 3, text: 'Containment\nprevents,', icon: '🔒' },
              { num: 4, text: 'Human authority\noverrides, &', icon: '👤' },
              { num: 5, text: 'Safe failure\ndetects', icon: '🛡️' },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-2">{step.icon}</div>
                <div className="text-sm text-slate-300 leading-tight">{step.text}</div>
                {index < 4 && <div className="text-2xl text-blue-400 mt-2">→</div>}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">
            Each principle reinforces the others, creating exponential resilience against adversarial attacks
          </p>
        </motion.div>
      </div>
    </section>
  );
}
