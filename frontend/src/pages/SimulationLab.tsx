import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/GlassCard'
import { NeonButton } from '@/components/NeonButton'
import { RiskBadge } from '@/components/RiskBadge'

/**
 * Simulation Lab Page
 * AI threat simulation and testing
 */
export default function SimulationLab() {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null)

  const simulations = [
    {
      id: 'phishing',
      name: 'Phishing Attack',
      description: 'Simulate a phishing email attack',
      difficulty: 'Easy',
      scenario: 'Receive a convincing phishing email and see how Nyxen detects it',
    },
    {
      id: 'account-takeover',
      name: 'Account Takeover',
      description: 'Simulate an account takeover attempt',
      difficulty: 'Hard',
      scenario: 'Attacker attempts to gain access from unusual location with credential stuffing',
    },
    {
      id: 'financial-fraud',
      name: 'Financial Fraud',
      description: 'Simulate fraudulent transaction',
      difficulty: 'Medium',
      scenario: 'Unauthorized transactions made using stolen card information',
    },
    {
      id: 'credential-leak',
      name: 'Credential Leak',
      description: 'Simulate password exposure',
      difficulty: 'Medium',
      scenario: 'Your password appears in a public database breach',
    },
    {
      id: 'social-engineering',
      name: 'Social Engineering',
      description: 'Simulate social engineering attack',
      difficulty: 'Hard',
      scenario: 'Attacker calls pretending to be from your bank requesting information',
    },
    {
      id: 'identity-theft',
      name: 'Identity Theft',
      description: 'Simulate identity theft scenario',
      difficulty: 'Hard',
      scenario: 'Your identity is used to open unauthorized accounts',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-2">AI Simulation Lab</h1>
        <p className="text-gray-400">Test Nyxen against realistic threat scenarios and see how it responds</p>
      </motion.div>

      {/* Simulation Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {simulations.map((sim, i) => (
          <motion.div
            key={sim.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-lg backdrop-blur-lg border transition-all cursor-pointer ${
              activeSimulation === sim.id
                ? 'border-neon-cyan/50 bg-white/8'
                : 'border-white/10 bg-white/5 hover:border-neon-cyan/30'
            }`}
            onClick={() => setActiveSimulation(sim.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{sim.name}</h3>
              <RiskBadge
                level={
                  sim.difficulty === 'Easy'
                    ? 'low'
                    : sim.difficulty === 'Medium'
                      ? 'medium'
                      : 'critical'
                }
                label={sim.difficulty}
                size="sm"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">{sim.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">{sim.id}</span>
              <NeonButton variant="secondary" size="sm">
                {activeSimulation === sim.id ? 'Selected' : 'Select'}
              </NeonButton>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Simulation Details */}
      {activeSimulation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
        >
          <GlassCard className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-4">
                {simulations.find((s) => s.id === activeSimulation)?.name}
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                {simulations.find((s) => s.id === activeSimulation)?.scenario}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-lg bg-white/5 border border-neon-cyan/30">
                <h3 className="font-semibold text-neon-cyan mb-3">Expected Nyxen Response</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Threat detection triggered</li>
                  <li>✓ Risk assessment completed</li>
                  <li>✓ Recommendations generated</li>
                  <li>✓ Autonomous actions initiated</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-neon-purple/30">
                <h3 className="font-semibold text-neon-purple mb-3">Learning Outcomes</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Understand threat patterns</li>
                  <li>✓ Learn detection methodology</li>
                  <li>✓ Review AI reasoning</li>
                  <li>✓ Test response protocols</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <NeonButton variant="primary" size="lg">
                🚀 Start Simulation
              </NeonButton>
              <NeonButton variant="secondary" size="lg">
                📊 View Report
              </NeonButton>
              <NeonButton variant="secondary" size="lg">
                🧠 AI Explanation
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  )
}
