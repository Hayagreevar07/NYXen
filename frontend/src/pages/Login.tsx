import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { GlassCard } from '@/components/GlassCard'
import { NeonButton } from '@/components/NeonButton'

/**
 * Login Page Component
 */
export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyber-darker via-cyber-dark to-cyber-dark">
      <GlassCard className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Nyxen</h1>
        <p className="text-center text-gray-400 mb-8">AI-Powered Protection Platform</p>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50"
          />
          
          <NeonButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            Sign In
          </NeonButton>
          
          <div className="text-center text-sm text-gray-400">
            Don't have an account? <a href="#" className="text-neon-cyan hover:underline">Sign up</a>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
