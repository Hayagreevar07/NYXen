import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

/**
 * GlassCard Component
 * Glassmorphism-styled card with neon effects
 */
export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5 } : {}}
      onClick={onClick}
      className={clsx(
        'relative rounded-xl backdrop-blur-lg',
        'bg-white/5 border border-white/10',
        'shadow-lg hover:shadow-neon-cyan',
        'transition-all duration-300',
        hover && 'cursor-pointer hover:border-neon-cyan/50 hover:bg-white/8',
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan/0 via-neon-purple/0 to-neon-pink/0 pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default GlassCard
