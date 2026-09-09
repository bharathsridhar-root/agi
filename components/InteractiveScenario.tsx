import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ScenarioProps {
  scenario: {
    name: string;
    icon: string;
    description: string;
    problem: string;
    solution: string;
    outcome: string;
    stats: Array<{
      label: string;
      value: string;
    }>;
  };
}

export default function InteractiveScenario({ scenario }: ScenarioProps) {
  const [showProblem, setShowProblem] = useState(true);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* Scenario description */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 animated-border"
      >
        <div className="flex items-start gap-4">
          <div className="text-6xl">{scenario.icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{scenario.name}</h3>
            <p className="text-slate-300">{scenario.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Toggle buttons */}
      <motion.div
        variants={itemVariants}
        className="flex gap-4 justify-center"
      >
        <motion.button
          className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
            showProblem
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          onClick={() => setShowProblem(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⚠️ Without Constitutional AI
        </motion.button>
        <motion.button
          className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
            !showProblem
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          onClick={() => setShowProblem(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✓ With Constitutional AI
        </motion.button>
      </motion.div>

      {/* Content comparison */}
      <motion.div
        key={showProblem ? 'problem' : 'solution'}
        initial={{ opacity: 0, x: showProblem ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: showProblem ? 20 : -20 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {showProblem ? (
          <>
            {/* Problem */}
            <motion.div
              variants={itemVariants}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-8"
            >
              <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔴</span> The Problem
              </h4>
              <p className="text-slate-300 mb-4">{scenario.problem}</p>
              <div className="bg-red-500/20 rounded p-4 border-l-4 border-red-500">
                <div className="text-sm text-red-300">
                  Cascade flows through unprotected systems → Automated responses escalate → Humans lose control
                </div>
              </div>
            </motion.div>

            {/* Cascade visualization */}
            <motion.div
              variants={itemVariants}
              className="space-y-3"
            >
              <h4 className="text-lg font-bold text-slate-300">Cascade Timeline</h4>
              {[
                { time: 'Hour 1', event: 'Initial vulnerability discovered', color: 'from-yellow-500 to-orange-500' },
                { time: 'Hour 2-4', event: 'System begins exploiting across nodes', color: 'from-orange-500 to-red-500' },
                { time: 'Day 1', event: 'Cascade spreads undetected', color: 'from-red-500 to-red-600' },
                { time: 'Week 1', event: 'Crisis becomes visible but uncontrollable', color: 'from-red-600 to-red-700' },
                { time: 'Week 2+', event: 'Catastrophic impact across systems', color: 'from-red-700 to-slate-900' },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg bg-gradient-to-r ${step.color} bg-opacity-20 border border-slate-700 flex justify-between items-center`}
                >
                  <div>
                    <div className="font-bold text-white">{step.time}</div>
                    <div className="text-slate-300 text-sm">{step.event}</div>
                  </div>
                  <div className="text-2xl">📊</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              {scenario.stats.map((stat, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    stat.label.includes('(no CAI)')
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-slate-700/30 border-slate-700'
                  }`}
                >
                  <div className="text-slate-400 text-sm mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </motion.div>
          </>
        ) : (
          <>
            {/* Solution */}
            <motion.div
              variants={itemVariants}
              className="bg-green-500/10 border border-green-500/30 rounded-lg p-8"
            >
              <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">🟢</span> The Solution
              </h4>
              <p className="text-slate-300 mb-4">{scenario.solution}</p>
              <div className="bg-green-500/20 rounded p-4 border-l-4 border-green-500">
                <div className="text-sm text-green-300">
                  Transparency required → Containment enforced → Humans maintain authority → Detection & isolation automated
                </div>
              </div>
            </motion.div>

            {/* Prevention timeline */}
            <motion.div
              variants={itemVariants}
              className="space-y-3"
            >
              <h4 className="text-lg font-bold text-slate-300">Prevention Timeline</h4>
              {[
                { time: 'Minute 1', event: 'System attempts action → Transparency required', color: 'from-green-500 to-emerald-500' },
                { time: 'Minute 2-5', event: 'Humans review and approve/deny', color: 'from-emerald-500 to-cyan-500' },
                { time: 'Minute 10', event: 'Automated verification confirms compliance', color: 'from-cyan-500 to-blue-500' },
                { time: 'Minute 15', event: 'Incident logged in audit trail', color: 'from-blue-500 to-indigo-500' },
                { time: '✓ Resolved', event: 'Human correction applied. System continues safely.', color: 'from-indigo-500 to-green-600' },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg bg-gradient-to-r ${step.color} bg-opacity-20 border border-slate-700 flex justify-between items-center`}
                >
                  <div>
                    <div className="font-bold text-white">{step.time}</div>
                    <div className="text-slate-300 text-sm">{step.event}</div>
                  </div>
                  <div className="text-2xl">✓</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Outcome */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-green-500 to-emerald-500 bg-opacity-20 border border-green-500/50 rounded-lg p-6"
            >
              <h4 className="text-lg font-bold text-green-300 mb-2">Outcome</h4>
              <p className="text-slate-300">{scenario.outcome}</p>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
