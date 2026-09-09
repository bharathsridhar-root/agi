import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Defense() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [expandedDefense, setExpandedDefense] = useState<number | null>(null);

  const defenses = [
    {
      layer: 'Layer 1',
      name: 'Byzantine Fault Tolerance',
      icon: '📊',
      description: 'Distributed authority prevents single-point takeover',
      mechanism: 'System requires agreement from 3+ independent auditors. If 1 is compromised, 2 of 3 remaining still agree.',
      prevents: ['Single nation-state control', 'Centralized authority compromise'],
      cost: 'High - requires compromising 2/3+ simultaneously',
      resilience: '95%',
    },
    {
      layer: 'Layer 2',
      name: 'Transparency & Auditability',
      icon: '👁️',
      description: 'All findings published publicly for verification',
      mechanism: 'Audit methodology and results are public. Thousands of independent observers can verify.',
      prevents: ['Hidden compromises', 'Falsification by single actor'],
      cost: 'High - requires coordinating with thousands of auditors',
      resilience: '90%',
    },
    {
      layer: 'Layer 3',
      name: 'Decentralized Incident Reporting',
      icon: '🚨',
      description: 'Independent monitoring detects suppression attempts',
      mechanism: 'Monitoring agents report anomalies even if operator suppresses. Silence becomes an alarm.',
      prevents: ['Report suppression', 'Cover-ups'],
      cost: 'High - requires destroying distributed monitoring infrastructure',
      resilience: '88%',
    },
    {
      layer: 'Layer 4',
      name: 'Cryptographic Verification',
      icon: '🔐',
      description: 'Tamper-evident signatures make retroactive changes impossible',
      mechanism: 'All reports cryptographically signed. Changes detected across distributed copies.',
      prevents: ['Record falsification', 'Retroactive modification'],
      cost: 'Extreme - requires breaking encryption or stealing private keys',
      resilience: '99%',
    },
    {
      layer: 'Layer 5',
      name: 'International Treaty Framework',
      icon: '🌍',
      description: 'Legal and economic enforcement for non-compliance',
      mechanism: 'Violators face market exclusion, sanctions, and loss of government contracts.',
      prevents: ['Brazen non-compliance', 'Unilateral defection'],
      cost: 'Very High - economic and geopolitical consequences',
      resilience: '85%',
    },
    {
      layer: 'Layer 6',
      name: 'Continuous Monitoring',
      icon: '📡',
      description: 'Real-time verification of deployed system integrity',
      mechanism: 'Certified systems monitored for modifications. Any deviation triggers alerts.',
      prevents: ['Post-deployment sabotage', 'Gradual degradation'],
      cost: 'High - requires maintaining monitoring infrastructure',
      resilience: '92%',
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
    <section id="defense" className="relative py-24 overflow-hidden">
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
            <span className="gradient-text">Layered Defense System</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Six defense layers that make takeover exponentially more difficult
          </motion.p>
        </motion.div>

        {/* Defense cards */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {defenses.map((defense, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group cursor-pointer"
              onClick={() => setExpandedDefense(expandedDefense === index ? null : index)}
            >
              {/* Card header */}
              <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-lg hover:bg-slate-800/50 transition-all duration-300 card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-5xl">{defense.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-blue-400 font-bold mb-1">{defense.layer}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{defense.name}</h3>
                      <p className="text-slate-400">{defense.description}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedDefense === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4 mt-2"
                  >
                    <div className="text-2xl">▼</div>
                  </motion.div>
                </div>

                {/* Resilience badge */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    {defense.prevents.map((prev, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                        {prev}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Resilience</div>
                    <div className={`text-lg font-bold ${
                      parseFloat(defense.resilience) >= 90 ? 'text-green-400' :
                      parseFloat(defense.resilience) >= 85 ? 'text-yellow-400' :
                      'text-orange-400'
                    }`}>
                      {defense.resilience}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {expandedDefense === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-900/50 border border-t-0 border-slate-700 rounded-b-lg overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      {/* Mechanism */}
                      <div>
                        <h4 className="text-lg font-bold text-slate-300 mb-2">How It Works</h4>
                        <p className="text-slate-400">{defense.mechanism}</p>
                      </div>

                      {/* Cost analysis */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded p-4 border border-slate-700">
                          <div className="text-sm text-slate-500 mb-1">Cost to Compromise</div>
                          <div className="text-slate-300 font-semibold">{defense.cost}</div>
                        </div>
                        <div className="bg-slate-800/50 rounded p-4 border border-slate-700">
                          <div className="text-sm text-slate-500 mb-1">Detectability</div>
                          <div className="text-slate-300 font-semibold">High - Any attempt leaves traces</div>
                        </div>
                      </div>

                      {/* Example attack scenario */}
                      <div className="bg-red-500/10 rounded p-4 border border-red-500/30">
                        <div className="text-sm text-red-400 font-bold mb-2">Attack Example</div>
                        <div className="text-slate-400 text-sm">
                          State actor attempts to compromise the system at this layer. Due to layered defenses, even if this layer is breached, the attack is detected at Layer {(index % 6) + 1} and contained.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div
          className="mt-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-8"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h3 className="text-2xl font-bold mb-4 text-slate-300">Defense in Depth Works</h3>
          <p className="text-slate-400 mb-4">
            No single layer is foolproof. But the stack together is exponentially more difficult to breach. An attacker would need to:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">1.</span>
              <span>Compromise distributed authority (2/3+ of independent auditors)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">2.</span>
              <span>Prevent public detection (coordinate with thousands of observers)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">3.</span>
              <span>Falsify records across all distributed copies (cryptographically impossible)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">4.</span>
              <span>Prevent incident reporting (destroy distributed monitoring)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">5.</span>
              <span>Survive international enforcement (face market exclusion and sanctions)</span>
            </li>
          </ul>
          <p className="text-slate-400 mt-4 text-sm italic">
            This is not foolproof. But it's exponentially more effective than no governance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
