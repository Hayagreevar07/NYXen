import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  onClose: () => void
}

/**
 * Toast Component
 * Notification toast with auto-dismiss
 */
export function Toast({ id, type, title, message, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-neon-green" />,
    error: <AlertCircle className="w-5 h-5 text-neon-pink" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-neon-cyan" />,
  }

  const colors = {
    success: 'border-neon-green/50 bg-neon-green/10',
    error: 'border-neon-pink/50 bg-neon-pink/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    info: 'border-neon-cyan/50 bg-neon-cyan/10',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-lg border p-4 flex gap-3 items-start ${colors[type]}`}
    >
      {icons[type]}
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        {message && <p className="text-sm text-gray-400 mt-1">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default Toast
