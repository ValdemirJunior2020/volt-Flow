import React from 'react'
import { Zap } from 'lucide-react'

const jobs = [
  { time: '12:20 AM', tech: 'Mike R.', type: 'Job Type', status: 'In Progress' },
  { time: '12:20 AM', tech: 'Mike R.', type: 'Residential In.', status: 'In Progress' },
  { time: '12:30 AM', tech: 'Mike R.', type: 'Residential', status: 'In Progress' },
  { time: '12:30 AM', tech: 'Mike R.', type: 'Job Type', status: 'In Progress' },
]

export default function ScheduledJobsTable() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-800">Today's Scheduled Jobs (Oct 26)</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-[10px] font-semibold text-slate-400 pb-2">Time</th>
            <th className="text-left text-[10px] font-semibold text-slate-400 pb-2">Technician</th>
            <th className="text-left text-[10px] font-semibold text-slate-400 pb-2">Job Type</th>
            <th className="text-left text-[10px] font-semibold text-slate-400 pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              <td className="py-2 text-[11px] text-slate-600 font-medium">{job.time}</td>
              <td className="py-2">
                <div className="flex items-center gap-1.5">
                  <img src={`https://i.pravatar.cc/20?img=12`} className="w-5 h-5 rounded-full" alt="tech" />
                  <span className="text-[11px] text-slate-700">{job.tech}</span>
                </div>
              </td>
              <td className="py-2 text-[11px] text-slate-600">{job.type}</td>
              <td className="py-2">
                <span className="bg-blue-100 text-blue-700 text-[9px] font-semibold px-2 py-0.5 rounded">{job.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
