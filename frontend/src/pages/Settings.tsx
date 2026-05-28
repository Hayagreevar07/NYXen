import { motion } from 'framer-motion'
import { GlassCard } from '@/components/GlassCard'
import { NeonButton } from '@/components/NeonButton'

/**
 * Settings Page
 * User preferences and configuration
 */
export default function Settings() {
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
      className="space-y-8 max-w-3xl"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your preferences and security settings</p>
      </motion.div>

      {/* Account Settings */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-neon-cyan/50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-neon-cyan/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-neon-cyan/50"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Security Settings */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
          <div className="space-y-4">
            {[
              { label: 'Two-Factor Authentication', enabled: true },
              { label: 'Login Alerts', enabled: true },
              { label: 'Suspicious Activity Notifications', enabled: true },
              { label: 'Weekly Security Report', enabled: false },
              { label: 'Automatic Session Timeout', enabled: true },
            ].map((setting, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="font-medium">{setting.label}</span>
                <div
                  className={`w-12 h-6 rounded-full transition-all ${
                    setting.enabled
                      ? 'bg-neon-green'
                      : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { type: 'Critical Threats', frequency: 'Immediate' },
              { type: 'High Risk Events', frequency: 'Every 30 mins' },
              { type: 'Medium Alerts', frequency: 'Hourly' },
              { type: 'Low Warnings', frequency: 'Daily Digest' },
              { type: 'AI Recommendations', frequency: 'Daily Digest' },
            ].map((notif, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <span>{notif.type}</span>
                <select className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-neon-cyan/50">
                  <option>{notif.frequency}</option>
                </select>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Connected Services */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold mb-6">Connected Services</h2>
          <div className="space-y-4">
            {[
              { service: 'Gmail', status: 'Connected' },
              { service: 'Google Drive', status: 'Connected' },
              { service: 'Banking App', status: 'Not Connected' },
              { service: 'Financial Accounts', status: 'Pending' },
            ].map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <h3 className="font-semibold">{svc.service}</h3>
                  <p className={`text-xs ${svc.status === 'Connected' ? 'text-neon-green' : 'text-gray-400'}`}>
                    {svc.status}
                  </p>
                </div>
                <NeonButton variant="secondary" size="sm">
                  {svc.status === 'Connected' ? 'Disconnect' : 'Connect'}
                </NeonButton>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Save Changes */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <NeonButton variant="primary" size="lg">
          💾 Save Changes
        </NeonButton>
        <NeonButton variant="secondary" size="lg">
          ↩️ Cancel
        </NeonButton>
      </motion.div>
    </motion.div>
  )
}
