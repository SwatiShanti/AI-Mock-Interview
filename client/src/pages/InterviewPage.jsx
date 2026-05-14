/**
 * pages/InterviewPage.jsx — Live interview session
 * Q&A flow with timer, progress bar, and answer textarea
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
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
  const { currentInterview, answers, updateAnswer, submitInterview, submitting } = useInterview()
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
            <div className="hidden sm:flex">
              <Badge type="blue" className="gap-1.5 py-1.5 px-4">
                <HiCheckCircle className="w-3.5 h-3.5" />
                {answered}/{total} answered
              </Badge>
            </div>
            {/* Timer */}
            <div className="flex items-center gap-1.5 glass-card px-4 py-1.5 font-mono text-sm text-primary-400 border-primary-500/20 bg-primary-500/5">
              <HiClock className="w-4 h-4" />
              {formatted}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-accent-500 shadow-glow transition-all duration-500"
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
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                i === currentIdx
                  ? 'bg-primary-600 text-white shadow-glow'
                  : answers[i]?.answer?.trim()
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <Card className="p-8 mb-6 animate-slide-up">
          <div className="flex items-start gap-5 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glow">
              <HiSparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Question {currentIdx + 1} of {total}</span>
                {current?.category && (
                  <Badge type="purple">{capitalize(current.category)}</Badge>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                {current?.question}
              </h2>
            </div>
          </div>

          {/* Answer textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Your Answer</label>
            <textarea
              id={`answer-${currentIdx}`}
              rows={8}
              value={thisAnswer}
              onChange={(e) => updateAnswer(currentIdx, e.target.value)}
              placeholder="Type your answer here… Be thorough and specific. Use examples where possible."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50
                         transition-all duration-200 resize-none text-base leading-relaxed"
            />
            <p className="text-xs text-gray-600 mt-2 text-right font-medium">{thisAnswer.length} characters</p>
          </div>
        </Card>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 py-3.5 px-6"
          >
            <HiChevronLeft className="w-5 h-5" /> Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentIdx < total - 1 ? (
              <Button
                onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
                className="flex items-center gap-2 py-3.5 px-8"
              >
                Next <HiChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 py-3.5 px-8"
              >
                <HiCheckCircle className="w-5 h-5" /> Submit Interview
              </Button>
            )}
          </div>
        </div>

        {/* Unanswered warning */}
        {answered < total && (
          <Card className="mt-6 border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3">
            <HiExclamationCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span className="text-amber-400 text-sm font-medium">
              {total - answered} question{total - answered > 1 ? 's' : ''} left unanswered. You can still submit for evaluation.
            </span>
          </Card>
        )}
      </div>

      {/* ── Confirm Submit Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <Card className="p-10 max-w-md w-full animate-slide-up shadow-2xl border-white/20">
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <HiCheckCircle className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Submit Interview?</h3>
            <p className="text-gray-400 text-sm text-center mb-2">
              You answered <span className="text-white font-bold">{answered} of {total}</span> questions.
            </p>
            <p className="text-gray-500 text-xs text-center mb-8 px-4">
              Azure AI will evaluate your responses and generate your performance report instantly.
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
                className="flex-1 py-3"
              >
                Go Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><LoadingSpinner size="sm" /><span>Evaluating…</span></>
                  : <><HiSparkles className="w-4 h-4" />Finish Now</>
                }
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
