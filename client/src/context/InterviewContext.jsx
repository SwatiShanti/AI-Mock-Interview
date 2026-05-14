/**
 * context/InterviewContext.jsx — Interview session state
 * Tracks: current interview, answers, timer
 */

import { createContext, useState, useCallback } from 'react'
import { interviewAPI } from '../api/interview.api'
import toast from 'react-hot-toast'

export const InterviewContext = createContext(null)

export function InterviewProvider({ children }) {
  const [currentInterview, setCurrentInterview] = useState(null)
  const [answers,          setAnswers]          = useState([])
  const [submitting,       setSubmitting]       = useState(false)
  const [result,           setResult]           = useState(null)

  // ── Start a new interview session ────────────────────────
  const startInterview = useCallback(async (setupData) => {
    const { data } = await interviewAPI.start(setupData)
    setCurrentInterview(data.interview)
    setAnswers(data.interview.questions.map(() => ({ answer: '' })))
    setResult(null)
    return data.interview
  }, [])

  // ── Update answer for a question index ───────────────────
  const updateAnswer = useCallback((index, text) => {
    setAnswers((prev) => {
      const updated = [...prev]
      updated[index] = { answer: text }
      return updated
    })
  }, [])

  // ── Submit all answers for AI evaluation ─────────────────
  const submitInterview = useCallback(async (duration) => {
    if (!currentInterview) return null
    setSubmitting(true)
    try {
      const { data } = await interviewAPI.submit({
        interviewId: currentInterview._id,
        answers,
        duration,
      })
      setResult(data.interview)
      setCurrentInterview(null)
      return data.interview
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed')
      throw error
    } finally {
      setSubmitting(false)
    }
  }, [currentInterview, answers])

  // ── Clear session ─────────────────────────────────────────
  const clearInterview = useCallback(() => {
    setCurrentInterview(null)
    setAnswers([])
    setResult(null)
  }, [])

  const value = {
    currentInterview,
    answers,
    submitting,
    result,
    startInterview,
    updateAnswer,
    submitInterview,
    clearInterview,
  }

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>
}
