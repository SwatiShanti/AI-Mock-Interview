/**
 * pages/SetupPage.jsx — Interview configuration page
 * User picks role, difficulty, question count, and optional JD
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useInterview } from '../hooks/useInterview'
import { getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'
import { HiSparkles, HiChevronRight } from 'react-icons/hi2'

const JOB_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Product Manager',
  'UI/UX Designer', 'Cloud Architect', 'Cybersecurity Analyst', 'QA Engineer',
  'Mobile Developer', 'Data Engineer', 'Solutions Architect',
]

const DIFFICULTIES = [
  { value: 'beginner',     label: 'Beginner',     desc: 'Basic concepts & fundamentals',        color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
  { value: 'intermediate', label: 'Intermediate',  desc: 'Practical experience expected',         color: 'border-amber-500/50 bg-amber-500/10 text-amber-400' },
  { value: 'advanced',     label: 'Advanced',      desc: 'Deep expertise & system design',        color: 'border-red-500/50 bg-red-500/10 text-red-400' },
]

const QUESTION_COUNTS = [3, 5, 7, 10]

export default function SetupPage() {
  const { startInterview } = useInterview()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    jobRole: '', customRole: '', difficulty: 'intermediate',
    questionCount: 5, jobDescription: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const role = form.jobRole === 'custom' ? form.customRole.trim() : form.jobRole
    if (!role) return toast.error('Please select or enter a job role')
    setLoading(true)
    try {
      const interview = await startInterview({
        jobRole: role,
        difficulty: form.difficulty,
        questionCount: form.questionCount,
        jobDescription: form.jobDescription,
      })
      toast.success('Interview started! Good luck 🎯')
      navigate(`/interview/${interview._id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-glow mb-4">
            <HiSparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set Up Your Interview</h1>
          <p className="text-gray-400">Configure your session and let AI generate tailored questions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
          {/* Step 1 — Role */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-xs flex items-center justify-center font-bold">1</span>
              Job Role
            </h2>
            <select
              value={form.jobRole}
              onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
              className="input-field mb-3"
              id="jobRole"
            >
              <option value="" disabled>Select a job role…</option>
              {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              <option value="custom">✏️ Enter custom role…</option>
            </select>
            {form.jobRole === 'custom' && (
              <input
                type="text" id="customRole"
                value={form.customRole}
                onChange={(e) => setForm({ ...form, customRole: e.target.value })}
                placeholder="e.g. Site Reliability Engineer"
                className="input-field"
              />
            )}
          </div>

          {/* Step 2 — Difficulty */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-xs flex items-center justify-center font-bold">2</span>
              Difficulty Level
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value} type="button"
                  onClick={() => setForm({ ...form, difficulty: d.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                    form.difficulty === d.value
                      ? d.color + ' shadow-lg'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <p className="font-semibold text-sm mb-1">{d.label}</p>
                  <p className="text-xs opacity-80">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 — Question Count */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-xs flex items-center justify-center font-bold">3</span>
              Number of Questions
            </h2>
            <div className="flex gap-3 flex-wrap">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n} type="button"
                  onClick={() => setForm({ ...form, questionCount: n })}
                  className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    form.questionCount === n
                      ? 'border-primary-500 bg-primary-500/20 text-primary-400 shadow-glow'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-2">Estimated time: ~{form.questionCount * 3}–{form.questionCount * 5} minutes</p>
          </div>

          {/* Step 4 — JD (optional) */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-600 text-xs flex items-center justify-center font-bold">4</span>
              Job Description
              <span className="text-xs text-gray-500 font-normal">(optional)</span>
            </h2>
            <p className="text-gray-500 text-xs mb-3">Paste JD to get more targeted questions.</p>
            <textarea
              id="jobDescription"
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
              rows={4}
              placeholder="Paste the job description here for more targeted questions…"
              className="input-field resize-none"
              maxLength={2000}
            />
            <p className="text-gray-600 text-xs mt-1 text-right">{form.jobDescription.length}/2000</p>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <><LoadingSpinner size="sm" /><span>Generating questions…</span></>
            ) : (
              <><HiSparkles className="w-5 h-5" />Generate Interview Questions<HiChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
