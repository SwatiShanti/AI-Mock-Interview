/**
 * pages/DashboardPage.jsx — Main user dashboard
 * Shows stats, score trend chart, and recent interviews
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { historyAPI } from '../api/interview.api'
import { formatDate, getScoreColor, capitalize, formatDuration, getDifficultyBadge } from '../utils/helpers'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  HiSparkles, HiTrophy, HiClock, HiChartBar, HiArrowRight,
  HiPlayCircle, HiClipboardDocumentList,
} from 'react-icons/hi2'
import Card from '../components/common/Card'

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className="p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </Card>
  )
}

// ── Custom Tooltip for chart ──────────────────────────────
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-sm">
      <p className="text-gray-400">{payload[0]?.payload?.jobRole}</p>
      <p className="text-primary-400 font-bold">{payload[0]?.value}%</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await historyAPI.getStats()
        setStats(data.stats)
      } catch {
        toast.error('Failed to load stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Build chart data
  const chartData = stats?.recentInterviews?.map((iv, i) => ({
    name: `#${i + 1}`,
    score: iv.overallScore,
    jobRole: iv.jobRole,
  })) || []

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Welcome ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-400">Track your progress and start a new interview session.</p>
          </div>
          <Link to="/interview/setup" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <HiPlayCircle className="w-5 h-5" />
            New Interview
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading your stats…" /></div>
        ) : (
          <>
            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={HiClipboardDocumentList} label="Total Interviews" value={stats?.totalInterviews ?? 0} sub="All time" color="bg-gradient-to-br from-primary-500 to-primary-700" />
              <StatCard icon={HiChartBar} label="Average Score" value={`${stats?.averageScore ?? 0}%`} sub="Across all sessions" color="bg-gradient-to-br from-accent-500 to-accent-700" />
              <StatCard icon={HiTrophy} label="Best Score" value={`${stats?.bestScore ?? 0}%`} sub="Personal record" color="bg-gradient-to-br from-amber-500 to-orange-600" />
              <StatCard icon={HiClock} label="Time Practiced" value={`${stats?.totalTime ?? 0}m`} sub="Total minutes" color="bg-gradient-to-br from-emerald-500 to-teal-600" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* ── Score Trend Chart ── */}
              <Card className="lg:col-span-2 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Score Trend</h2>
                    <p className="text-gray-500 text-sm">Your last {chartData.length} interviews</p>
                  </div>
                  <HiChartBar className="w-5 h-5 text-primary-400" />
                </div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#4b5563" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} stroke="#4b5563" tick={{ fontSize: 12 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5}
                        fill="url(#scoreGrad)" dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#818cf8' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex flex-col items-center justify-center text-gray-600">
                    <HiChartBar className="w-12 h-12 mb-3 opacity-30" />
                    <p>Complete your first interview to see trends</p>
                  </div>
                )}
              </Card>

              {/* ── Role Breakdown ── */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-1">By Role</h2>
                <p className="text-gray-500 text-sm mb-5">Top practiced roles</p>
                {stats?.byRole?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.byRole.map((r) => (
                      <div key={r._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300 truncate">{r._id}</span>
                          <span className="text-primary-400 font-semibold">{Math.round(r.avgScore)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transition-all duration-700"
                            style={{ width: `${Math.round(r.avgScore)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                    <HiSparkles className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm text-center">Practice different roles to see breakdown</p>
                  </div>
                )}
              </Card>
            </div>

            {/* ── Recent Interviews ── */}
            <Card className="mt-6 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Recent Interviews</h2>
                <Link to="/history" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors">
                  View all <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {stats?.recentInterviews?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-white/5">
                        <th className="text-left pb-3 font-medium">Role</th>
                        <th className="text-left pb-3 font-medium">Difficulty</th>
                        <th className="text-left pb-3 font-medium">Score</th>
                        <th className="text-left pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[...stats.recentInterviews].reverse().map((iv, i) => (
                        <tr key={i} className="hover:bg-white/3 transition-colors">
                          <td className="py-3 text-gray-200 font-medium">{iv.jobRole}</td>
                          <td className="py-3">
                            <span className={getDifficultyBadge(iv.difficulty)}>{capitalize(iv.difficulty)}</span>
                          </td>
                          <td className="py-3">
                            <span className={`${getScoreColor(iv.overallScore)} font-semibold`}>{iv.overallScore}%</span>
                          </td>
                          <td className="py-3 text-gray-500">{formatDate(iv.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <HiPlayCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="mb-4">No interviews yet. Start your first session!</p>
                  <Link to="/interview/setup" className="btn-primary inline-flex items-center gap-2">
                    <HiPlayCircle className="w-4 h-4" /> Start Interview
                  </Link>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
