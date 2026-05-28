import { motion } from 'framer-motion'
import { GlassCard } from '@/components/GlassCard'
import { RiskBadge } from '@/components/RiskBadge'
import { NeonButton } from '@/components/NeonButton'

/**
 * Identity Protection Page
 * Identity monitoring and protection features
 */
export default function IdentityProtection() {
  const loginAttempts = [
    { location: 'New York, USA', device: 'Chrome on Windows', time: '2 hours ago', status: 'verified' },
    { location: 'Tokyo, Japan', device: 'Safari on macOS', time: '6 hours ago', status: 'suspicious' },
    { location: 'London, UK', device: 'Chrome on Android', time: '1 day ago', status: 'verified' },
  ]

  const credentials = [
    { service: 'Gmail', status: 'exposed', action: 'Change Password' },
    { service: 'GitHub', status: 'safe', action: 'Enable 2FA' },
    { service: 'Banking', status: 'safe', action: 'Review' },
    { service: 'LinkedIn', status: 'exposed', action: 'Change Password' },
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
        <h1 className="text-4xl font-bold mb-2">Identity Protection</h1>
        <p className="text-gray-400">Monitor login attempts, credentials, and cross-platform identity risks</p>
      </motion.div>

      {/* Protection Status */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Identity Score', value: '78%', color: 'neon-green' },
          { label: 'Exposed Passwords', value: '2', color: 'neon-pink' },
          { label: 'Suspicious Logins', value: '1', color: 'yellow-400' },
          { label: 'Protected Services', value: '8/10', color: 'neon-cyan' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-lg backdrop-blur-lg bg-white/5 border border-white/10"
          >
            <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Login Attempts */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Login Attempts</h2>
          <div className="space-y-4">
            {loginAttempts.map((attempt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon-cyan/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{attempt.location}</h3>
                    <p className="text-sm text-gray-400">{attempt.device}</p>
                  </div>
                  <RiskBadge
                    level={attempt.status === 'verified' ? 'safe' : 'high'}
                    label={attempt.status}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-gray-500">{attempt.time}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Credential Status */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">Credential Security Status</h2>
          <div className="space-y-3">
            {credentials.map((cred, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-white mb-1">{cred.service}</h3>
                  <RiskBadge
                    level={cred.status === 'safe' ? 'safe' : 'critical'}
                    label={cred.status}
                    size="sm"
                  />
                </div>
                <NeonButton variant="secondary" size="sm">
                  {cred.action}
                </NeonButton>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Device Monitoring */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">Connected Devices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'MacBook Pro', type: 'Desktop', lastActive: '5 mins ago', risk: 'low' },
              { name: 'iPhone 14', type: 'Mobile', lastActive: '2 hours ago', risk: 'low' },
              { name: 'iPad', type: 'Tablet', lastActive: '1 day ago', risk: 'low' },
              { name: 'Unknown Device', type: 'Unknown', lastActive: '3 days ago', risk: 'high' },
            ].map((device, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{device.name}</h3>
                  <RiskBadge level={device.risk as any} size="sm" />
                </div>
                <p className="text-sm text-gray-400 mb-1">{device.type}</p>
                <p className="text-xs text-gray-500">Last active: {device.lastActive}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
