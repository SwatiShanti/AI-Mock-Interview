/**
 * pages/ReportPage.jsx — AI evaluation results page
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import { useInterview } from '../hooks/useInterview'
import { interviewAPI } from '../api/interview.api'
import { capitalize, formatDuration, getDifficultyBadge } from '../utils/helpers'
import { HiTrophy, HiSparkles, HiCheckCircle, HiArrowPath, HiLightBulb, HiChevronDown, HiChevronUp, HiHome } from 'react-icons/hi2'

function ScoreRing({ score }) {
  const r = 56, circ = 2 * Math.PI * r
  const pct  = Math.min(Math.max(score, 0), 100)
  const dash  = (pct / 100) * circ
  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{ transition: 'stroke-dasharray 1.2s ease-out', filter: `drop-shadow(0 0 8px ${color}88)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white">{score}</span>
        <span className="text-gray-400 text-xs">/ 100</span>
      </div>
    </div>
  )
}

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false)
  const bar = q.score >= 8 ? 'bg-emerald-500' : q.score >= 6 ? 'bg-amber-500' : 'bg-red-500'
  const txt = q.score >= 8 ? 'text-emerald-400' : q.score >= 6 ? 'text-amber-400' : 'text-red-400'
  return (
    <Card className="p-0 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-600/30 text-primary-400 text-sm font-bold flex items-center justify-center">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium line-clamp-1">{q.question}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-28">
              <div className={`h-full ${bar} rounded-full`} style={{ width: `${(q.score / 10) * 100}%` }} />
            </div>
            <span className={`text-sm font-bold ${txt}`}>{q.score}/10</span>
          </div>
        </div>
        {open ? <HiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <HiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-white/10 p-5 space-y-4 animate-slide-up">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Your Answer</p>
            <p className="text-gray-300 text-sm bg-white/3 rounded-xl p-3 leading-relaxed">
              {q.answer || <span className="text-gray-600 italic">No answer provided</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <HiSparkles className="w-3.5 h-3.5 text-primary-400" /> AI Feedback
            </p>
            <p className="text-gray-300 text-sm bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 leading-relaxed">
              {q.feedback || 'No feedback available.'}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function ReportPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { result } = useInterview()
  const [interview, setInterview] = useState(result)
  const [loading,   setLoading]   = useState(!result)

  useEffect(() => {
    if (!result) {
      interviewAPI.getById(id)
        .then(({ data }) => { setInterview(data.interview); setLoading(false) })
        .catch(() => navigate('/dashboard'))
    }
  }, [id]) // eslint-disable-line

  if (loading || !interview) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><LoadingSpinner size="lg" text="Loading results…" /></div>
  }

  const score = interview.overallScore ?? 0
  const label = score >= 80 ? '🏆 Excellent!' : score >= 60 ? '👍 Good Job' : '📚 Keep Practicing'

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Hero */}
        <Card className="p-8 text-center relative overflow-hidden animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-600/5 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-1">
              <HiTrophy className="w-5 h-5 text-amber-400" />
              <span className="text-gray-400 text-sm">Interview Complete</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{label}</h1>
            <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
              <Badge type="blue">{interview.jobRole}</Badge>
              <Badge type={interview.difficulty === 'beginner' ? 'green' : interview.difficulty === 'intermediate' ? 'yellow' : 'red'}>
                {capitalize(interview.difficulty)}
              </Badge>
              {interview.duration > 0 && <Badge type="purple">⏱ {formatDuration(interview.duration)}</Badge>}
            </div>
            <ScoreRing score={score} />
            <p className="text-gray-400 text-sm mt-3">Overall Score</p>
          </div>
        </Card>

        {/* Overall Feedback */}
        {interview.overallFeedback && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <HiSparkles className="w-5 h-5 text-primary-400" /> AI Overall Feedback
            </h2>
            <p className="text-gray-300 leading-relaxed">{interview.overallFeedback}</p>
          </Card>
        )}

        {/* Strengths & Improvements */}
        <div className="grid sm:grid-cols-2 gap-4">
          {interview.strengths?.length > 0 && (
            <Card className="p-6 border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5 text-emerald-400" /> Strengths
              </h3>
              <ul className="space-y-2">
                {interview.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {interview.improvements?.length > 0 && (
            <Card className="p-6 border-amber-500/20 bg-amber-500/5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <HiLightBulb className="w-5 h-5 text-amber-400" /> Areas to Improve
              </h3>
              <ul className="space-y-2">
                {interview.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Question Breakdown */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 px-1">Question-by-Question Breakdown</h2>
          <div className="space-y-4">
            {interview.questions.map((q, i) => <QuestionCard key={i} q={q} index={i} />)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/interview/setup" className="flex-1">
            <Button className="w-full flex items-center justify-center gap-2 py-4">
              <HiArrowPath className="w-5 h-5" /> Practice Again
            </Button>
          </Link>
          <Link to="/dashboard" className="flex-1">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2 py-4">
              <HiHome className="w-5 h-5" /> Dashboard
            </Button>
          </Link>
          <Link to="/history" className="flex-1">
            <Button variant="secondary" className="w-full py-4">
              View History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
