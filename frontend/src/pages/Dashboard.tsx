import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, TrendingUp, Shield, Zap } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { StatCard } from '@/components/StatCard'
import { RiskBadge } from '@/components/RiskBadge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useThreatStore } from '@/store/threatStore'
import apiService from '@/services/apiService'

/**
 * Dashboard Page
 * Main security dashboard with real-time threat monitoring
 */
export default function Dashboard() {
  const { riskScore, identityScore, financialRiskScore, threats } = useThreatStore()
  const [loading, setLoading] = useState(true)
  const [activeAlerts, setActiveAlerts] = useState(15)

  useEffect(() => {
    // Fetch dashboard data
    const loadData = async () => {
      try {
        await apiService.getDashboardData()
        setLoading(false)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Initializing Nyxen..." />
      </div>
    )
  }

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
      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-2">Security Dashboard</h1>
        <p className="text-gray-400">Real-time threat monitoring and autonomous protection</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          label="Risk Score"
          value={riskScore}
          unit="%"
          change={-5}
          trend="down"
          icon={<AlertCircle className="w-5 h-5" />}
        />
        <StatCard
          label="Identity Score"
          value={identityScore}
          unit="%"
          change={8}
          trend="up"
          icon={<Shield className="w-5 h-5" />}
        />
        <StatCard
          label="Financial Risk"
          value={financialRiskScore}
          unit="%"
          change={-12}
          trend="down"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          label="Active Agents"
          value={6}
          change={100}
          trend="up"
          icon={<Zap className="w-5 h-5" />}
        />
      </motion.div>

      {/* Threat Feed and Analysis */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Threat Feed */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Threats</h2>
            <RiskBadge level="high" label={`${activeAlerts} Alerts`} />
          </div>

          <div className="space-y-4">
            {[
              {
                id: '1',
                type: 'Phishing Attempt',
                description: 'Suspicious email detected from unknown sender',
                severity: 'high' as const,
                time: '2 mins ago',
              },
              {
                id: '2',
                type: 'Account Anomaly',
                description: 'Login from new location - Tokyo, JP',
                severity: 'medium' as const,
                time: '15 mins ago',
              },
              {
                id: '3',
                type: 'Credential Exposure',
                description: 'Password found in breach database',
                severity: 'critical' as const,
                time: '1 hour ago',
              },
              {
                id: '4',
                type: 'Unusual Spending',
                description: '300% increase in transaction volume',
                severity: 'medium' as const,
                time: '2 hours ago',
              },
            ].map((threat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon-cyan/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">
                    {threat.type}
                  </h3>
                  <RiskBadge level={threat.severity} size="sm" />
                </div>
                <p className="text-sm text-gray-400 mb-2">{threat.description}</p>
                <p className="text-xs text-gray-500">{threat.time}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Autonomous Response */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-6">Autonomous Response</h3>
          <div className="space-y-3">
            {[
              { action: 'Enable 2FA', status: 'recommended' },
              { action: 'Lockdown Account', status: 'recommended' },
              { action: 'Review Logins', status: 'active' },
              { action: 'Reset Credentials', status: 'pending' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.action}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.status === 'active'
                        ? 'bg-neon-green'
                        : item.status === 'pending'
                          ? 'bg-yellow-400'
                          : 'bg-neon-cyan'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Agent Status */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">Autonomous Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Financial Intelligence', status: 'active', tasks: 127 },
              { name: 'Threat Correlation', status: 'active', tasks: 89 },
              { name: 'Identity Protection', status: 'active', tasks: 234 },
              { name: 'Behavioral Drift', status: 'monitoring', tasks: 56 },
              { name: 'Response Engine', status: 'active', tasks: 12 },
              { name: 'Explainability', status: 'analyzing', tasks: 43 },
            ].map((agent, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon-purple/50 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white text-sm">{agent.name}</h4>
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      agent.status === 'active' ? 'bg-neon-green' : 'bg-neon-cyan'
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-400 mb-2">{agent.tasks} tasks</p>
                <p className="text-xs text-neon-cyan font-mono capitalize">
                  {agent.status}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
