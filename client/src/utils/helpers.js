/**
 * utils/helpers.js — Shared utility functions
 */

/** Format seconds → "X min Y sec" */
export const formatDuration = (seconds) => {
  if (!seconds) return '0 min'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m} min ${s > 0 ? s + ' sec' : ''}`.trim() : `${s} sec`
}

/** Get badge color class based on score (0–100) */
export const getScoreColor = (score) => {
  if (score >= 80) return 'badge-green'
  if (score >= 60) return 'badge-yellow'
  return 'badge-red'
}

/** Get Tailwind text color for score */
export const getScoreTextColor = (score) => {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}

/** Capitalize first letter */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

/** Truncate long text */
export const truncate = (str, n = 80) =>
  str?.length > n ? str.slice(0, n) + '…' : str

/** Format date */
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/** Difficulty badge variant */
export const getDifficultyBadge = (difficulty) => {
  const map = { beginner: 'badge-green', intermediate: 'badge-yellow', advanced: 'badge-red' }
  return map[difficulty] || 'badge-blue'
}

/** Extract error message from Axios error */
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong'
