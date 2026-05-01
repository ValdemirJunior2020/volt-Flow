// client/src/pages/SyncLogsPage.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { quickbooksService } from '../services/quickbooksService'

export default function SyncLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLogs() {
      setLoading(true)
      setError('')
      try {
        const payload = await quickbooksService.getSyncLogs({ limit: 100 })
        setLogs(payload.data.items || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadLogs()
  }, [])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesQuery = `${log.action} ${log.message} ${log.source} ${log.qbId} ${log.localId}`.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === 'all' || log.status === status
      return matchesQuery && matchesStatus
    })
  }, [logs, query, status])

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Observability</p>
        <h1 className="text-2xl font-bold text-slate-900">Sync Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Search, filter, and audit QuickBooks sync activity.</p>
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search size={15} className="text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs..." className="bg-transparent outline-none w-full text-sm" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="skipped">Skipped</option>
          </select>
        </div>
      </section>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Timestamp</th>
                  <th className="px-5 py-3 text-left">Action</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Source</th>
                  <th className="px-5 py-3 text-left">Local ID</th>
                  <th className="px-5 py-3 text-left">QB ID</th>
                  <th className="px-5 py-3 text-left">Duration</th>
                  <th className="px-5 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr><td colSpan="8" className="px-5 py-8 text-center text-slate-400">No logs found.</td></tr>
                ) : filteredLogs.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 whitespace-nowrap text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-5 py-3 font-semibold text-slate-800">{log.action}</td>
                    <td className="px-5 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${log.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{log.status}</span></td>
                    <td className="px-5 py-3 text-slate-500">{log.source || '-'}</td>
                    <td className="px-5 py-3 text-slate-500">{log.localId || '-'}</td>
                    <td className="px-5 py-3 text-slate-500">{log.qbId || '-'}</td>
                    <td className="px-5 py-3 text-slate-500">{log.durationMs ? `${log.durationMs}ms` : '-'}</td>
                    <td className="px-5 py-3 text-slate-500 min-w-72">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
