import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import { T_SCORE_ELEVATED } from '../data/scales'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 max-w-xs">
      <p className="font-semibold text-gray-900 text-sm">{d.fullName}</p>
      <p className="text-xs text-gray-500 mb-1">{d.abbrev}</p>
      <p className="text-lg font-bold" style={{ color: d.barColor }}>
        T = {d.tScore}
      </p>
      <p className="text-xs text-gray-400 mt-1">Raw: {d.rawScore}/{d.maxRaw}</p>
    </div>
  )
}

function getBarColor(tScore) {
  if (tScore >= 85) return '#dc2626'
  if (tScore >= 75) return '#f97316'
  if (tScore >= 65) return '#eab308'
  return '#94a3b8'
}

export default function ScaleChart({ scores, category, title }) {
  const data = Object.values(scores)
    .filter((s) => s.category === category)
    .map((s) => ({
      name: s.abbrev,
      fullName: s.name,
      abbrev: s.abbrev,
      tScore: s.tScore,
      rawScore: s.rawScore,
      maxRaw: s.maxRaw,
      barColor: getBarColor(s.tScore),
    }))

  if (data.length === 0) return null

  return (
    <div className="card mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="w-full" style={{ height: Math.max(200, data.length * 40 + 60) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[30, 100]}
              ticks={[30, 40, 50, 60, 65, 70, 80, 90, 100]}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={50}
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <ReferenceLine
              x={T_SCORE_ELEVATED}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: 'Elevated', position: 'top', fontSize: 10, fill: '#ef4444' }}
            />
            <ReferenceLine
              x={50}
              stroke="#94a3b8"
              strokeDasharray="2 2"
              strokeWidth={1}
            />
            <Bar dataKey="tScore" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.barColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
