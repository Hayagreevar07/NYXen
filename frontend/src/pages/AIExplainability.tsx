import { motion } from 'framer-motion'
import { GlassCard } from '@/components/GlassCard'
import { NeonButton } from '@/components/NeonButton'

/**
 * AI Explainability Page
 * Understand AI reasoning and decision-making
 */
export default function AIExplainability() {
  const explanations = [
    {
      title: 'Why was this threat detected?',
      reasoning:
        'Multiple behavioral anomalies were detected simultaneously: login from new geographic location, unusual login time, device fingerprint mismatch.',
      confidence: 94,
      factors: [
        'IP geolocation mismatch (92%)',
        'Device behavior deviation (87%)',
        'Time-of-access anomaly (78%)',
        'User agent mismatch (85%)',
      ],
    },
    {
      title: 'What is the predicted impact?',
      reasoning:
        'Based on similar attack patterns in our database, this threat has a 76% probability of being an account takeover attempt targeting financial data.',
      confidence: 76,
      factors: [
        'Matches known takeover pattern (89%)',
        'High-value account target (84%)',
        'Financial data at risk (79%)',
        'Lateral movement possible (72%)',
      ],
    },
    {
      title: 'What actions are recommended?',
      reasoning:
        'The autonomous response engine recommends immediate protective measures to prevent unauthorized access while maintaining account usability.',
      confidence: 91,
      factors: [
        'MFA enablement (98%)',
        'Session termination (94%)',
        'Password reset (89%)',
        'Account lockdown (87%)',
      ],
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
        <h1 className="text-4xl font-bold mb-2">🧠 AI Explainability</h1>
        <p className="text-gray-400">
          Understand how Gemini AI detects threats, reasons about them, and makes recommendations
        </p>
      </motion.div>

      {/* Explainability Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6"
      >
        {explanations.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">{exp.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">{exp.reasoning}</p>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-white/5 border border-neon-cyan/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-neon-cyan">Confidence Score</span>
                  <span className="text-2xl font-bold text-neon-cyan">{exp.confidence}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${exp.confidence}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contributing Factors</h3>
                <div className="space-y-3">
                  {exp.factors.map((factor, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.05 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-300">{factor.split('(')[0]}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-neon-cyan font-bold">{factor.match(/\d+/)?.[0]}%</span>
                        <div className="w-16 bg-white/10 rounded-full h-1">
                          <div
                            className="bg-neon-cyan h-1 rounded-full"
                            style={{ width: `${factor.match(/\d+/)?.[0]}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <NeonButton variant="secondary">View Full Analysis</NeonButton>
                <NeonButton variant="secondary">Export Report</NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* How Gemini Works */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6">How Gemini AI Reasoning Works</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Data Collection',
                desc: 'Collect behavioral, financial, and identity data across all platforms and devices',
              },
              {
                step: 2,
                title: 'Pattern Analysis',
                desc: 'Use machine learning to identify normal vs abnormal patterns in user behavior',
              },
              {
                step: 3,
                title: 'Threat Modeling',
                desc: 'Map detected anomalies against known attack patterns and threat models',
              },
              {
                step: 4,
                title: 'Risk Calculation',
                desc: 'Calculate composite risk scores based on multiple correlated factors',
              },
              {
                step: 5,
                title: 'Action Generation',
                desc: 'Generate autonomous defensive recommendations with explanations',
              },
              {
                step: 6,
                title: 'Execution & Learning',
                desc: 'Execute recommendations and learn from outcomes to improve future detection',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-neon-cyan/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
