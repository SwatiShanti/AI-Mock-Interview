/**
 * hooks/useTimer.js — Interview countdown timer hook
 * Returns: { elapsed, formatted, start, stop, reset }
 */
import { useState, useRef, useCallback, useEffect } from 'react'

export const useTimer = (autoStart = false) => {
  const [elapsed, setElapsed]   = useState(0)   // seconds
  const [running, setRunning]   = useState(false)
  const intervalRef             = useRef(null)

  const start = useCallback(() => {
    if (running) return
    setRunning(true)
    intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
  }, [running])

  const stop = useCallback(() => {
    setRunning(false)
    clearInterval(intervalRef.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    setElapsed(0)
  }, [stop])

  useEffect(() => {
    if (autoStart) start()
    return () => clearInterval(intervalRef.current)
  }, []) // eslint-disable-line

  // Format: MM:SS
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const seconds = String(elapsed % 60).padStart(2, '0')
  const formatted = `${minutes}:${seconds}`

  return { elapsed, formatted, running, start, stop, reset }
}
