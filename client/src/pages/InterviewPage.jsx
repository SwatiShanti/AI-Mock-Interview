/**
 * pages/InterviewPage.jsx — Live interview session
 * Q&A flow with timer, progress bar, and answer textarea
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useInterview } from '../hooks/useInterview'
import { useTimer } from '../hooks/useTimer'
import { capitalize } from '../utils/helpers'
import { interviewAPI } from '../api/interview.api'
import toast from 'react-hot-toast'
import {
  HiClock, HiChevronLeft, HiChevronRight,
  HiCheckCircle, HiSparkles, HiExclamationCircle,
} from 'react-icons/hi2'

export default function InterviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentInterview, answers, updateAnswer, submitInterview, submitting, startInterview } = useInterview()
  const { formatted, elapsed, start: startTimer, stop: stopTimer } = useTimer()

  const [interview,    setInterview]    = useState(currentInterview)
  const [currentIdx,   setCurrentIdx]   = useState(0)
  const [loading,      setLoading]      = useState(!currentInterview)
  const [showConfirm,  setShowConfirm]  = useState(false)

  // ── Load interview if navigated directly ──────────────────
  useEffect(() => {
    if (!currentInterview) {
      interviewAPI.getById(id)
        .then(({ data }) => {
          setInterview(data.interview)
          setLoading(false)
        })
        .catch(() => {
          toast.error('Interview not found')
          navigate('/dashboard')
        })
    } else {
      setInterview(currentInterview)
      setLoading(false)
    }
  }, [id]) // eslint-disable-line

  // ── Start timer on load ───────────────────────────────────
  useEffect(() => {
    if (!loading) startTimer()
    return () => stopTimer()
  }, [loading]) // eslint-disable-line

  const questions  = interview?.questions || []
  const total      = questions.length
  const current    = questions[currentIdx]
  const progress   = total > 0 ? ((currentIdx + 1) / total) * 100 : 0
  const thisAnswer = answers[currentIdx]?.answer || ''
  const answered   = answers.filter((a) => a?.answer?.trim()).length

  const handleSubmit = async () => {
    stopTimer()
    try {
      const result = await submitInterview(elapsed)
      navigate(`/interview/${result._id}/report`)
    } catch {
      toast.error('Submission failed, please try again')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading interview…" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* ── Top bar ── */}
      <div className="sticky top-16 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-semibold text-white truncate">{interview?.jobRole}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500">Difficulty</p>
              <p className="text-sm font-semibold text-white">{capitalize(interview?.difficulty)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Answered counter */}
            <div className="hidden sm:flex items-center gap-1.5 badge badge-blue">
              <HiCheckCircle className="w-3.5 h-3.5" />
              {answered}/{total} answered
            </div>
            {/* Timer */}
            <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 font-mono text-sm text-primary-400">
              <HiClock className="w-4 h-4" />
              {formatted}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-accent-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Question stepper */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                i === currentIdx
                  ? 'bg-primary-600 text-white shadow-glow'
                  : answers[i]?.answer?.trim()
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="glass-card p-8 mb-6 animate-slide-up">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glow">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 font-medium">Question {currentIdx + 1} of {total}</span>
                {current?.category && (
                  <span className="badge badge-purple">{capitalize(current.category)}</span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                {current?.question}
              </h2>
            </div>
          </div>

          {/* Answer textarea */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Your Answer</label>
            <textarea
              id={`answer-${currentIdx}`}
              rows={7}
              value={thisAnswer}
              onChange={(e) => updateAnswer(currentIdx, e.target.value)}
              placeholder="Type your answer here… Be thorough and specific. Use examples where possible."
              className="input-field resize-none text-sm leading-relaxed"
            />
            <p className="text-xs text-gray-600 mt-1.5 text-right">{thisAnswer.length} characters</p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-30"
          >
            <HiChevronLeft className="w-5 h-5" /> Previous
          </button>

          <div className="flex items-center gap-3">
            {currentIdx < total - 1 ? (
              <button
                onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
                className="btn-primary flex items-center gap-2"
              >
                Next <HiChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <HiCheckCircle className="w-5 h-5" /> Submit Interview
              </button>
            )}
          </div>
        </div>

        {/* Unanswered warning */}
        {answered < total && (
          <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm glass-card px-4 py-3">
            <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
            <span>{total - answered} question{total - answered > 1 ? 's' : ''} unanswered. You can still submit.</span>
          </div>
        )}
      </div>

      {/* ── Confirm Submit Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full animate-slide-up">
            <HiCheckCircle className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white text-center mb-2">Submit Interview?</h3>
            <p className="text-gray-400 text-sm text-center mb-2">
              You answered <span className="text-white font-semibold">{answered} of {total}</span> questions.
            </p>
            <p className="text-gray-500 text-xs text-center mb-6">
              Azure AI will evaluate all your answers and generate detailed feedback.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
                className="btn-secondary flex-1"
              >
                Keep Going
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><LoadingSpinner size="sm" /><span>Evaluating…</span></>
                  : <><HiSparkles className="w-4 h-4" />Submit & Get Results</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
