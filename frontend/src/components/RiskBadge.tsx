import { motion } from 'framer-motion'
import clsx from 'clsx'

interface RiskBadgeProps {
  level: 'critical' | 'high' | 'medium' | 'low' | 'safe'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * RiskBadge Component
 * Displays threat/risk levels with color coding
 */
export function RiskBadge({ level, label, size = 'md' }: RiskBadgeProps) {
  const colors = {
    critical: 'bg-neon-pink/20 text-neon-pink border-neon-pink/50',
    high: 'bg-red-500/20 text-red-400 border-red-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    safe: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const levelLabels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    safe: 'Safe',
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        'rounded-full border font-semibold inline-block',
        'flex items-center gap-1',
        sizes[size],
        colors[level]
      )}
    >
      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
      {label || levelLabels[level]}
    </motion.div>
  )
}

export default RiskBadge
