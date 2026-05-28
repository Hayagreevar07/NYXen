import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GlassCard } from '@/components/GlassCard'
import { StatCard } from '@/components/StatCard'
import { RiskBadge } from '@/components/RiskBadge'

/**
 * Financial Intelligence Page
 * Financial analytics and spending analysis
 */
export default function FinancialIntelligence() {
  const spendingData = [
    { date: 'Mon', amount: 450 },
    { date: 'Tue', amount: 620 },
    { date: 'Wed', amount: 890 },
    { date: 'Thu', amount: 750 },
    { date: 'Fri', amount: 1200 },
    { date: 'Sat', amount: 1450 },
    { date: 'Sun', amount: 980 },
  ]

  const categories = [
    { name: 'Subscriptions', amount: '$285', trend: '+45%', risk: 'medium' },
    { name: 'Groceries', amount: '$620', trend: '-12%', risk: 'low' },
    { name: 'Dining', amount: '$480', trend: '+35%', risk: 'low' },
    { name: 'Online Shopping', amount: '$890', trend: '+120%', risk: 'high' },
    { name: 'Transportation', amount: '$245', trend: '-5%', risk: 'low' },
    { name: 'Entertainment', amount: '$350', trend: '+65%', risk: 'medium' },
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
        <h1 className="text-4xl font-bold mb-2">Financial Intelligence</h1>
        <p className="text-gray-400">Spending analysis, fraud detection, and financial risk assessment</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard label="This Month" value="$6,895" change={35} trend="up" />
        <StatCard label="Average Daily" value="$225" change={-8} trend="down" />
        <StatCard label="Predicted Balance" value="$3,450" change={12} trend="up" />
        <StatCard label="Fraud Risk" value="Low" />
      </motion.div>

      {/* Spending Chart */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">Weekly Spending Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10,14,39,0.8)', border: '1px solid rgba(0,217,255,0.3)' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#00d9ff"
                strokeWidth={2}
                dot={{ fill: '#00d9ff', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Category Analysis */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h3 className="text-2xl font-bold mb-6">Spending by Category</h3>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{cat.name}</span>
                  <RiskBadge level={cat.risk as any} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neon-cyan text-lg font-bold">{cat.amount}</span>
                  <span className={`text-sm font-semibold ${cat.trend.startsWith('+') ? 'text-neon-pink' : 'text-neon-green'}`}>
                    {cat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6">
          <h3 className="text-2xl font-bold mb-4">🧠 Gemini AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-neon-cyan/30">
              <h4 className="font-semibold text-neon-cyan mb-2">Forgotten Subscriptions</h4>
              <p className="text-sm text-gray-300">Detected 3 unused subscriptions costing $45/month. Recommend cancellation to save $540/year.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-neon-purple/30">
              <h4 className="font-semibold text-neon-purple mb-2">Lifestyle Creep</h4>
              <p className="text-sm text-gray-300">Dining expenses increased 65% over past month. May impact savings goals if trend continues.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-yellow-500/30">
              <h4 className="font-semibold text-yellow-400 mb-2">Unusual Activity</h4>
              <p className="text-sm text-gray-300">Online shopping spike detected. Verify recent purchases are legitimate transactions.</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
