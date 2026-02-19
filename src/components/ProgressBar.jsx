export default function ProgressBar({ value, max, className = '' }) {
  const pct = Math.round((value / max) * 100)

  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-calm-400 to-calm-600 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
