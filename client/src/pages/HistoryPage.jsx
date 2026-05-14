/**
 * pages/HistoryPage.jsx — Paginated interview history table
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { historyAPI } from '../api/interview.api'
import { formatDate, getDifficultyBadge, capitalize, formatDuration, getScoreTextColor } from '../utils/helpers'
import { HiTrash, HiEye, HiChevronLeft, HiChevronRight, HiClipboardDocumentList, HiPlayCircle } from 'react-icons/hi2'
import toast from 'react-hot-toast'

export default function HistoryPage() {
  const [interviews, setInterviews] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading,    setLoading]    = useState(true)
  const [deleting,   setDeleting]   = useState(null)
  const [page,       setPage]       = useState(1)

  const fetchHistory = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await historyAPI.getHistory({ page: p, limit: 10 })
      setInterviews(data.data)
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory(page) }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview record?')) return
    setDeleting(id)
    try {
      await historyAPI.delete(id)
      toast.success('Interview deleted')
      fetchHistory(page)
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Interview History</h1>
            <p className="text-gray-400 text-sm">
              {pagination.total} total session{pagination.total !== 1 ? 's' : ''} completed
            </p>
          </div>
          <Link to="/interview/setup" className="btn-primary flex items-center gap-2 self-start">
            <HiPlayCircle className="w-5 h-5" /> New Interview
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading history…" /></div>
        ) : interviews.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <HiClipboardDocumentList className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-xl mb-2">No interviews yet</h3>
            <p className="text-gray-500 mb-6">Start your first mock interview to build your history.</p>
            <Link to="/interview/setup" className="btn-primary inline-flex items-center gap-2">
              <HiPlayCircle className="w-5 h-5" /> Start Interview
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="glass-card overflow-hidden hidden sm:block">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-gray-500">
                    <th className="text-left px-6 py-4 font-medium">Job Role</th>
                    <th className="text-left px-6 py-4 font-medium">Difficulty</th>
                    <th className="text-left px-6 py-4 font-medium">Score</th>
                    <th className="text-left px-6 py-4 font-medium">Questions</th>
                    <th className="text-left px-6 py-4 font-medium">Duration</th>
                    <th className="text-left px-6 py-4 font-medium">Date</th>
                    <th className="text-left px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {interviews.map((iv) => (
                    <tr key={iv._id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{iv.jobRole}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getDifficultyBadge(iv.difficulty)}>{capitalize(iv.difficulty)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${getScoreTextColor(iv.overallScore)}`}>
                          {iv.overallScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{iv.questionCount || '—'}</td>
                      <td className="px-6 py-4 text-gray-400">{iv.duration ? formatDuration(iv.duration) : '—'}</td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(iv.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/interview/${iv._id}/report`}
                            className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                            title="View Report"
                          >
                            <HiEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(iv._id)}
                            disabled={deleting === iv._id}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === iv._id
                              ? <LoadingSpinner size="sm" />
                              : <HiTrash className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 sm:hidden">
              {interviews.map((iv) => (
                <div key={iv._id} className="glass-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-white font-semibold">{iv.jobRole}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{formatDate(iv.createdAt)}</p>
                    </div>
                    <span className={`text-xl font-black ${getScoreTextColor(iv.overallScore)}`}>
                      {iv.overallScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={getDifficultyBadge(iv.difficulty)}>{capitalize(iv.difficulty)}</span>
                    {iv.duration > 0 && <span className="badge badge-purple">{formatDuration(iv.duration)}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/interview/${iv._id}/report`} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2 text-sm">
                      <HiEye className="w-4 h-4" /> View Report
                    </Link>
                    <button onClick={() => handleDelete(iv._id)} disabled={deleting === iv._id}
                      className="btn-danger px-4 py-2 text-sm">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary px-4 py-2 flex items-center gap-1 disabled:opacity-40">
                  <HiChevronLeft className="w-5 h-5" /> Prev
                </button>
                <span className="text-gray-400 text-sm">Page {page} of {pagination.pages}</span>
                <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                  className="btn-secondary px-4 py-2 flex items-center gap-1 disabled:opacity-40">
                  Next <HiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
