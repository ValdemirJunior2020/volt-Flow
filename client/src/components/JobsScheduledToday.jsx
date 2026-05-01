import React from 'react'
import { Zap, MapPin } from 'lucide-react'

const jobs = [
  { name: '12 jobs scheduled today', sub: '' },
  { name: 'Mike R.', sub: 'Residential Install' },
  { name: 'Sarah F.', sub: 'Residential Install', status: 'In Progress' },
]

export default function JobsScheduledToday() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500">Jobs Scheduled Today</span>
        <Zap size={14} className="text-[#f5d000]" fill="#f5d000" />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-3">12</div>

      <div className="flex gap-3">
        {/* Job list */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin size={10} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-700">12 jobs</p>
              <p className="text-[10px] text-slate-400">scheduled today</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://i.pravatar.cc/24?img=12" className="w-6 h-6 rounded-full" alt="Mike" />
            <div>
              <p className="text-[11px] font-semibold text-slate-700">Mike R.</p>
              <p className="text-[10px] text-slate-400">Residential Install</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://i.pravatar.cc/24?img=5" className="w-6 h-6 rounded-full" alt="Sarah" />
            <div className="flex items-center gap-1 flex-1">
              <div>
                <p className="text-[11px] font-semibold text-slate-700">Sarah F.</p>
                <p className="text-[10px] text-slate-400">Residential Install</p>
              </div>
              <span className="ml-auto bg-blue-100 text-blue-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">In Progress</span>
            </div>
          </div>
        </div>

        {/* Mini map placeholder */}
        <div className="w-20 h-20 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
            {/* Grid lines */}
            {[20, 40, 60, 80].map(y => (
              <div key={y} className="absolute w-full border-t border-slate-300/60" style={{ top: `${y}%` }} />
            ))}
            {[25, 50, 75].map(x => (
              <div key={x} className="absolute h-full border-l border-slate-300/60" style={{ left: `${x}%` }} />
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full w-3 h-3 flex items-center justify-center shadow-md">
              <MapPin size={7} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
