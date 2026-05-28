import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, TrendingUp, Lock, Brain, AlertCircle } from 'lucide-react'
import { NeonButton } from '@/components/NeonButton'

/**
 * LandingPage Component
 * Stunning futuristic landing page with hero section
 */
export default function LandingPage() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Threat Detection',
      description: 'AI-powered detection of phishing, fraud, and account takeovers',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Behavioral Intelligence',
      description: 'Analyze and predict anomalous behavior patterns in real-time',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Financial Analytics',
      description: 'Monitor spending patterns and predict financial risks',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Autonomous Response',
      description: 'Automatic threat response and mitigation recommendations',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Identity Protection',
      description: 'Cross-platform identity monitoring and protection',
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: 'Explainability',
      description: 'Understand why threats were detected with Gemini AI',
    },
  ]

  const stats = [
    { label: 'Threats Blocked', value: '10,000+' },
    { label: 'Active Agents', value: '6' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Response Time', value: '<100ms' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker via-cyber-dark to-cyber-dark overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{ y: [0, 100, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -100, 0], x: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="inline-block">
                <div className="text-6xl md:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                    Nyxen
                  </span>
                </div>
                <div className="h-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full mt-4" />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
            >
              AI-Powered Behavioral Intelligence &<br />
              <span className="text-neon-cyan">Autonomous Protection</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Gemini-powered autonomous SOC analyst that predicts, detects, explains, and
              autonomously responds to phishing, fraud, and identity threats in real-time.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex gap-4 justify-center flex-wrap"
            >
              <NeonButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
                className="text-lg"
              >
                Launch Nyxen
              </NeonButton>
              <NeonButton
                variant="secondary"
                size="lg"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-lg"
              >
                Explore Features
              </NeonButton>
            </motion.div>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            variants={itemVariants}
            className="mb-20 p-6 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-neon-green text-sm font-mono">LIVE THREAT FEED</span>
            </div>
            <motion.div className="space-y-2">
              {['Suspicious login detected - Tokyo', 'Phishing email blocked', 'Unusual spending pattern identified', 'Session anomaly detected'].map((threat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-3 rounded bg-white/5 border border-neon-cyan/20 text-sm text-gray-300 font-mono flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                  {threat}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-lg backdrop-blur-lg bg-white/5 border border-white/10 text-center hover:border-neon-cyan/50 transition-all duration-300"
              >
                <div className="text-3xl font-bold text-neon-cyan mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div
            id="features"
            variants={itemVariants}
            className="mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-center mb-16"
            >
              Core <span className="text-neon-cyan">Capabilities</span>
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 hover:border-neon-cyan/50 transition-all duration-300"
                >
                  <div className="text-neon-cyan mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="text-center p-12 rounded-xl backdrop-blur-lg bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Assets?</h2>
            <p className="text-gray-300 mb-8">
              Join the autonomous security revolution with Nyxen
            </p>
            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg"
            >
              Get Started Now
            </NeonButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
