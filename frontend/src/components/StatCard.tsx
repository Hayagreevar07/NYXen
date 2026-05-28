import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  change?: number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

/**
 * StatCard Component
 * Displays key metrics with trends
 */
export function StatCard({
  label,
  value,
  unit,
  change,
  icon,
  trend = 'neutral',
  className,
}: StatCardProps) {
  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-neon-green" />,
    down: <TrendingDown className="w-4 h-4 text-neon-pink" />,
    neutral: <Minus className="w-4 h-4 text-neon-cyan" />,
  }

  const trendColors = {
    up: 'text-neon-green',
    down: 'text-neon-pink',
    neutral: 'text-neon-cyan',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={clsx(
        'p-6 rounded-lg backdrop-blur-lg',
        'bg-white/5 border border-white/10',
        'hover:border-neon-cyan/50 hover:bg-white/8',
        'transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        {icon && <div className="text-neon-cyan">{icon}</div>}
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
      </div>

      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
          {trendIcons[trend]}
          <span className="font-semibold">
            {trend === 'up' ? '+' : ''}{change}%
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default StatCard
