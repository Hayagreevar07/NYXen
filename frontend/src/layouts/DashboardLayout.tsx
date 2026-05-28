import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

/**
 * DashboardLayout Component
 * Main layout for authenticated pages with sidebar navigation
 */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Threat Analytics', path: '/threat-analytics', icon: '⚠️' },
    { name: 'Financial Intelligence', path: '/financial-intelligence', icon: '💰' },
    { name: 'Identity Protection', path: '/identity-protection', icon: '🔐' },
    { name: 'Simulation Lab', path: '/simulation-lab', icon: '🧪' },
    { name: 'AI Explainability', path: '/ai-explainability', icon: '🧠' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker via-cyber-dark to-cyber-dark flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:relative lg:translate-x-0 w-64 h-screen bg-cyber-dark/80 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col z-50"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Nyxen
          </h1>
          <p className="text-xs text-gray-500 font-mono">v1.0.0</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <motion.a
              key={item.path}
              href={item.path}
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all group"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="group-hover:text-neon-cyan transition-colors">{item.name}</span>
            </motion.a>
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/10 pt-4">
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-neon-pink"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-cyber-dark/50 backdrop-blur-lg sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white hover:text-neon-cyan transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-semibold">User Name</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
        />
      )}
    </div>
  )
}
