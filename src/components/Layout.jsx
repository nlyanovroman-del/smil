import { Link, useLocation } from 'react-router-dom'
import useAppStore from '../store/appStore'

const stages = [
  { path: '/test', label: 'Assessment', step: 1 },
  { path: '/results', label: 'Insights', step: 2 },
  { path: '/interact', label: 'Interact', step: 3 },
]

export default function Layout({ children }) {
  const location = useLocation()
  const { answers, scores } = useAppStore()
  const isHome = location.pathname === '/'

  const getStageStatus = (stage) => {
    if (stage.path === '/test') {
      if (Object.keys(answers).length === 338) return 'completed'
      if (Object.keys(answers).length > 0) return 'in-progress'
      return 'available'
    }
    if (stage.path === '/results') {
      return scores ? 'available' : 'locked'
    }
    if (stage.path === '/interact') {
      return scores ? 'available' : 'locked'
    }
    return 'locked'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-calm-700 font-semibold text-lg hover:text-calm-800 transition-colors">
            <span className="text-2xl">&#9786;</span>
            SMIL
          </Link>

          {!isHome && (
            <nav className="flex items-center gap-1">
              {stages.map((stage) => {
                const status = getStageStatus(stage)
                const isActive = location.pathname === stage.path
                return (
                  <Link
                    key={stage.path}
                    to={status === 'locked' ? '#' : stage.path}
                    onClick={(e) => status === 'locked' && e.preventDefault()}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-calm-100 text-calm-700'
                        : status === 'locked'
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                      ${isActive
                        ? 'bg-calm-600 text-white'
                        : status === 'completed'
                          ? 'bg-green-500 text-white'
                          : status === 'locked'
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-gray-300 text-white'
                      }
                    `}>
                      {status === 'completed' ? '✓' : stage.step}
                    </span>
                    <span className="hidden sm:inline">{stage.label}</span>
                  </Link>
                )
              })}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400">
          <p>
            SMIL — Self-Mapping &amp; Insight Lab. For educational and self-exploration purposes only.
          </p>
          <p className="mt-1">
            This assessment is inspired by MMPI-2-RF scale structures but uses original items.
            It is not a clinical diagnostic tool.
          </p>
        </div>
      </footer>
    </div>
  )
}
