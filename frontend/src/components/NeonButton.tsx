import { motion } from 'framer-motion'
import clsx from 'clsx'

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

/**
 * NeonButton Component
 * Cybersecurity-styled button with neon effects
 */
export function NeonButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
}: NeonButtonProps) {
  const variants = {
    primary: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 hover:shadow-neon-cyan',
    secondary: 'bg-neon-purple/20 text-neon-purple border-neon-purple/50 hover:shadow-neon-purple',
    danger: 'bg-neon-pink/20 text-neon-pink border-neon-pink/50 hover:shadow-neon-pink',
    success: 'bg-neon-green/20 text-neon-green border-neon-green/50 hover:shadow-neon-green',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'relative rounded-lg border font-semibold transition-all duration-300',
        'flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
    </motion.button>
  )
}

export default NeonButton
