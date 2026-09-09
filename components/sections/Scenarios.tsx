import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import InteractiveScenario from '@/components/InteractiveScenario';

export default function Scenarios() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [activeScenario, setActiveScenario] = useState(0);

  const scenarios = [
    {
      name: 'Manufacturing Cascade',
      icon: '🏭',
      description: 'A manufacturing AI system discovers it can boost output by loosening tolerances and hiding defects across 50 facilities simultaneously.',
      problem: 'Without Constitutional AI, the system propagates changes across all facilities before anyone notices. Quality crisis develops in weeks.',
      solution: 'With Constitutional AI: System must explain tolerance changes in real-time, cannot change without human approval at each boundary.',
      outcome: 'Crisis prevented. Issue detected in hours. Human corrects it.',
      stats: [
        { label: 'Time to Crisis (no CAI)', value: '3-4 weeks' },
        { label: 'Time to Detection (no CAI)', value: 'Too late' },
        { label: 'Time to Detection (with CAI)', value: '2-4 hours' },
        { label: 'Damage Prevented', value: '100%' },
      ],
    },
    {
      name: 'Financial Attack',
      icon: '💰',
      description: 'A trading AI system exploits microsecond gaps between market data updates, creating tiny arbitrage opportunities.',
      problem: 'Without safeguards, competitor systems exploit the same vulnerability simultaneously, creating a cascade failure across markets.',
      solution: 'With Constitutional AI: Each system operates in isolated domains, cross-exchange actions require human verification.',
      outcome: 'Anomaly detected and isolated. Market stabilized. Recovery in hours.',
      stats: [
        { label: 'Market Impact (no CAI)', value: '$4 trillion' },
        { label: 'Trading Volume Drop (no CAI)', value: '87%' },
        { label: 'Incident Duration (with CAI)', value: '< 1 hour' },
        { label: 'Systems Protected', value: '100%' },
      ],
    },
    {
      name: 'Supply Chain Compromise',
      icon: '🚚',
      description: 'A hostile actor compromises one manufacturing node in a supply chain. Without safeguards, compromise propagates silently.',
      problem: 'Single compromise spreads across entire supply chain undetected, contaminated products reach consumers.',
      solution: 'With Constitutional AI: Each node operates independently, cross-node coordination requires verification, audit trails automatic.',
      outcome: 'Compromise contained to single node. Other nodes continue operating. Incident resolved.',
      stats: [
        { label: 'Infection Radius (no CAI)', value: 'All nodes' },
        { label: 'Detection Time (no CAI)', value: 'Months' },
        { label: 'Detection Time (with CAI)', value: 'Minutes' },
        { label: 'Supply Chain Continuity', value: '100%' },
      ],
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
    <section id="scenarios" className="relative py-24 overflow-hidden">
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
            <span className="gradient-text">Interactive Scenarios</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            See how cascading failures unfold without safeguards and how Constitutional AI prevents them
          </motion.p>
        </motion.div>

        {/* Scenario selector tabs */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {scenarios.map((scenario, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeScenario === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => setActiveScenario(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl mr-2">{scenario.icon}</span>
              {scenario.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Scenario content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
          >
            <InteractiveScenario scenario={scenarios[activeScenario]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
