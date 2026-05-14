/**
 * hooks/useInterview.js — Convenience hook for InterviewContext
 */
import { useContext } from 'react'
import { InterviewContext } from '../context/InterviewContext'

export const useInterview = () => {
  const ctx = useContext(InterviewContext)
  if (!ctx) throw new Error('useInterview must be used within InterviewProvider')
  return ctx
}
