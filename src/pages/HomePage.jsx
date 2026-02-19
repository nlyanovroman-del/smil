import { Link } from 'react-router-dom'
import useAppStore from '../store/appStore'

const stages = [
  {
    step: 1,
    title: 'Assessment',
    description: 'Complete a 338-item personality assessment inspired by the MMPI-2-RF. Answer True or False to each statement at your own pace — your progress is saved automatically.',
    icon: '📋',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    step: 2,
    title: 'Insights',
    description: 'See your personality profile visualized across multiple dimensions. Discover which traits are most prominent and understand what they mean.',
    icon: '📊',
    color: 'bg-calm-100 text-calm-700',
  },
  {
    step: 3,
    title: 'Interact',
    description: 'Meet your traits face-to-face. Choose how to personify them — as storybook characters, movie heroes, or stuffed animals — and have real conversations to understand and work with them.',
    icon: '💬',
    color: 'bg-warm-100 text-warm-700',
  },
]

export default function HomePage() {
  const { answers, scores, resetTest } = useAppStore()
  const hasProgress = Object.keys(answers).length > 0

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Self-Mapping &amp; Insight Lab
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
          Discover your personality patterns, visualize what stands out,
          and practice seeing your traits as parts of you — not all of you.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/test" className="btn-primary text-lg px-8 py-4">
            {hasProgress ? 'Continue Assessment' : 'Begin'}
          </Link>
          {hasProgress && (
            <button
              onClick={() => {
                if (window.confirm('This will erase all your progress. Are you sure?')) {
                  resetTest()
                }
              }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Start over
            </button>
          )}
        </div>

        {hasProgress && (
          <p className="mt-4 text-sm text-gray-400">
            {Object.keys(answers).length} of 338 questions answered
            {scores && ' — Results ready'}
          </p>
        )}
      </div>

      {/* Three Stages */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {stages.map((stage) => (
          <div key={stage.step} className="card text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4 ${stage.color}`}>
              {stage.icon}
            </div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Stage {stage.step}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {stage.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {stage.description}
            </p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="card bg-amber-50 border-amber-100 mb-8">
        <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
        <p className="text-sm text-amber-700 leading-relaxed">
          This tool is for <strong>educational and self-exploration purposes only</strong>.
          It is not a clinical diagnostic instrument. The assessment uses original items
          inspired by the MMPI-2-RF scale structure but is not the actual MMPI-2-RF,
          which is a copyrighted product of the University of Minnesota.
          If you are experiencing psychological distress, please consult a qualified
          mental health professional.
        </p>
      </div>

      {/* Approach */}
      <div className="card mb-8">
        <h4 className="font-semibold text-gray-900 mb-3">The Approach: Disidentification</h4>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          We all have personality patterns — ways of thinking, feeling, and reacting
          that can feel like "just who we are." But psychological research shows that
          these patterns are <em>parts</em> of us, not the whole picture.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          <strong>Disidentification</strong> is the practice of stepping back from a trait
          to see it as something you <em>have</em> rather than something you <em>are</em>.
          When you can observe a pattern from the outside — when you can talk to it,
          understand its origins, and appreciate its purpose — it loosens its grip.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          In Stage 3, you'll personify your most prominent traits as characters and have
          conversations with them. This technique draws from Internal Family Systems (IFS),
          psychosynthesis, and narrative therapy traditions.
        </p>
      </div>
    </div>
  )
}
