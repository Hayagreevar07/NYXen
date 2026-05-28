import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { GlassCard } from '@/components/GlassCard'
import { RiskBadge } from '@/components/RiskBadge'
import { NeonButton } from '@/components/NeonButton'

/**
 * Threat Analytics Page
 * Detailed threat analysis and correlations
 */
export default function ThreatAnalytics() {
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null)

  const threatData = [
    { time: '00:00', phishing: 12, fraud: 8, takeover: 5 },
    { time: '04:00', phishing: 19, fraud: 12, takeover: 8 },
    { time: '08:00', phishing: 28, fraud: 15, takeover: 12 },
    { time: '12:00', phishing: 35, fraud: 22, takeover: 18 },
    { time: '16:00', phishing: 45, fraud: 28, takeover: 25 },
    { time: '20:00', phishing: 52, fraud: 35, takeover: 32 },
    { time: '24:00', phishing: 61, fraud: 42, takeover: 38 },
  ]

  const correlationData = [
    { name: 'IP Anomaly', value: 45 },
    { name: 'Device Drift', value: 62 },
    { name: 'Behavioral Change', value: 38 },
    { name: 'Credential Exposure', value: 71 },
    { name: 'Spending Pattern', value: 55 },
  ]

  const threats = [
    { id: '1', type: 'Phishing Attack', count: 61, trend: '+45%', severity: 'critical' },
    { id: '2', type: 'Financial Fraud', count: 42, trend: '+65%', severity: 'high' },
    { id: '3', type: 'Account Takeover', count: 38, trend: '+120%', severity: 'critical' },
    { id: '4', type: 'Identity Theft', count: 24, trend: '+35%', severity: 'high' },
    { id: '5', type: 'Credential Leak', count: 19, trend: '-12%', severity: 'medium' },
    { id: '6', type: 'Session Hijack', count: 15, trend: '+8%', severity: 'high' },
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
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-2">Threat Analytics</h1>
        <p className="text-gray-400">Real-time threat detection and correlation analysis</p>
      </motion.div>

      {/* Threat Timeline */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">24-Hour Threat Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={threatData}>
              <defs>
                <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10,14,39,0.8)', border: '1px solid rgba(0,217,255,0.3)' }}
              />
              <Area type="monotone" dataKey="phishing" stroke="#00d9ff" fillOpacity={1} fill="url(#colorPhishing)" />
              <Area type="monotone" dataKey="fraud" stroke="#a855f7" fillOpacity={1} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Threat Types Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {threats.map((threat, i) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedThreat(threat.id)}
            className={`p-6 rounded-lg backdrop-blur-lg border transition-all cursor-pointer ${
              selectedThreat === threat.id
                ? 'border-neon-cyan/50 bg-white/8'
                : 'border-white/10 bg-white/5 hover:border-neon-cyan/30'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-white">{threat.type}</h3>
              <RiskBadge level={threat.severity} size="sm" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-neon-cyan">{threat.count}</span>
              <span className="text-sm text-gray-400">threats</span>
            </div>
            <p className={`text-sm font-semibold ${threat.trend.startsWith('+') ? 'text-neon-pink' : 'text-neon-green'}`}>
              {threat.trend} vs last 24h
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Correlation Analysis */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-2xl font-bold mb-6">Event Correlations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10,14,39,0.8)', border: '1px solid rgba(0,217,255,0.3)' }}
              />
              <Bar dataKey="value" fill="#00d9ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-2xl font-bold mb-6">Recommendations</h3>
          <div className="space-y-3">
            {[
              'Increase monitoring on credential exposure vectors',
              'Enhance device behavior verification protocols',
              'Implement additional IP geolocation checks',
              'Review recent login activities from new locations',
              'Enable enhanced anomaly detection algorithms',
            ].map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-neon-cyan/30 text-sm"
              >
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Gemini Analysis */}
      {selectedThreat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
        >
          <GlassCard className="p-6">
            <h3 className="text-2xl font-bold mb-4">🧠 Gemini AI Analysis</h3>
            <p className="text-gray-300 mb-4">
              This threat was detected due to multiple correlated anomalies. The attack pattern matches known phishing campaigns targeting financial institutions. Recommend enabling advanced MFA and reviewing all recent account activities.
            </p>
            <NeonButton variant="secondary">View Full Explanation</NeonButton>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  )
}
