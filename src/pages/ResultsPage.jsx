import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import { scoreAssessment, getElevatedScales, getPersonifiableElevated } from '../utils/scoring'
import { scaleCategories, T_SCORE_ELEVATED } from '../data/scales'
import ScaleChart from '../components/ScaleChart'
import TraitCard from '../components/TraitCard'
import CharacterCreator from '../components/CharacterCreator'

const VIEWS = {
  SCORES: 'scores',
  PARTS: 'parts',
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const { answers, scores, setScores, selectedTraits, toggleTrait, customCharacters } = useAppStore()
  const [view, setView] = useState(VIEWS.SCORES)
  const [creatingCharacterFor, setCreatingCharacterFor] = useState(null)

  // Compute scores if not already done
  useEffect(() => {
    if (!scores && Object.keys(answers).length > 0) {
      setScores(scoreAssessment(answers))
    }
  }, [answers, scores, setScores])

  if (!scores) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-gray-400 mb-4">No assessment results yet.</p>
        <button onClick={() => navigate('/test')} className="btn-primary">
          Take the Assessment
        </button>
      </div>
    )
  }

  const elevated = getElevatedScales(scores)
  const personifiable = getPersonifiableElevated(scores, 60) // slightly lower threshold for more options
  const answeredCount = Object.keys(answers).length
  const hasCritical = scores.SUI?.tScore >= T_SCORE_ELEVATED

  const handleInteract = (scaleId) => {
    if (!selectedTraits.includes(scaleId)) {
      toggleTrait(scaleId)
    }
    navigate('/interact')
  }

  return (
    <div className="page-container">
      {/* Header with view toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {view === VIEWS.SCORES ? 'Your Profile' : 'Your Inner Parts'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Based on {answeredCount} of 338 responses
            {answeredCount < 338 && ' (partial)'}
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView(VIEWS.SCORES)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === VIEWS.SCORES
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Scales
          </button>
          <button
            onClick={() => setView(VIEWS.PARTS)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === VIEWS.PARTS
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🃏 Inner Parts
          </button>
        </div>
      </div>

      {/* Critical alert */}
      {hasCritical && (
        <div className="card bg-red-50 border-red-200 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-800">Important</h4>
              <p className="text-sm text-red-700 mt-1">
                Your responses suggest you may be experiencing thoughts of self-harm.
                If you are in crisis, please contact the{' '}
                <strong>988 Suicide &amp; Crisis Lifeline</strong> (call or text 988)
                or your local emergency services. You matter, and help is available.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ SCORES VIEW ============ */}
      {view === VIEWS.SCORES && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-900">{elevated.length}</div>
              <div className="text-xs text-gray-400 mt-1">Elevated Scales</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-calm-600">{personifiable.length}</div>
              <div className="text-xs text-gray-400 mt-1">Inner Parts Found</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-900">
                {elevated.length > 0 ? elevated[0].abbrev : '—'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Highest Scale</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-900">
                {elevated.length > 0 ? `T=${elevated[0].tScore}` : '—'}
              </div>
              <div className="text-xs text-gray-400 mt-1">Peak T-Score</div>
            </div>
          </div>

          {/* Elevated scales highlight */}
          {elevated.length > 0 && (
            <div className="card bg-calm-50 border-calm-100 mb-8">
              <h3 className="font-semibold text-calm-800 mb-3">Elevated Traits (T ≥ 65)</h3>
              <div className="flex flex-wrap gap-2">
                {elevated.map((s) => (
                  <span
                    key={s.id}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium
                      ${s.tScore >= 85 ? 'bg-red-100 text-red-700' :
                        s.tScore >= 75 ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'}
                    `}
                  >
                    {s.abbrev}: T={s.tScore} — {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Charts by category */}
          {Object.entries(scaleCategories)
            .filter(([key]) => key !== 'validity')
            .map(([key, cat]) => (
              <ScaleChart
                key={key}
                scores={scores}
                category={key}
                title={cat.label}
              />
            ))}

          {/* Validity scales (collapsed) */}
          <details className="card mb-6">
            <summary className="cursor-pointer text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Validity Indicators
            </summary>
            <div className="mt-4">
              <ScaleChart scores={scores} category="validity" title="" />
            </div>
          </details>

          {/* CTA to Inner Parts view */}
          {personifiable.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Ready to meet the parts behind these scores?
              </p>
              <button
                onClick={() => setView(VIEWS.PARTS)}
                className="btn-primary text-lg px-8"
              >
                Meet Your Inner Parts →
              </button>
            </div>
          )}
        </>
      )}

      {/* ============ INNER PARTS VIEW ============ */}
      {view === VIEWS.PARTS && (
        <>
          <div className="card bg-calm-50 border-calm-100 mb-8">
            <p className="text-sm text-calm-700 leading-relaxed">
              Each card below represents an <strong>inner part</strong> — a personality
              pattern that showed up strongly in your assessment. These aren't "problems"
              to fix. They're parts of you that developed for a reason, often as protection.
              Tap a card to learn more, then select the ones you'd like to have a conversation with.
            </p>
          </div>

          {personifiable.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No strongly elevated personality parts found.</p>
              <p className="text-sm text-gray-300">
                Your profile is relatively balanced. You can still explore the interaction
                feature — lower the threshold or retake the assessment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {personifiable.map((scale) => (
                  <TraitCard
                    key={scale.id}
                    scale={scale}
                    customCharacter={customCharacters[scale.id]}
                    isSelected={selectedTraits.includes(scale.id)}
                    onToggle={toggleTrait}
                    onInteract={handleInteract}
                    onCustomize={() => setCreatingCharacterFor(scale.id)}
                  />
                ))}
              </div>

              {/* Action bar */}
              {selectedTraits.length > 0 && (
                <div className="sticky bottom-4 z-40">
                  <div className="card bg-white/95 backdrop-blur-sm shadow-xl border-calm-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedTraits.length} part{selectedTraits.length !== 1 ? 's' : ''} selected
                      </p>
                      <p className="text-xs text-gray-400">
                        Ready to have a conversation
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/interact')}
                      className="btn-warm"
                    >
                      Start Talking →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Back to scores link */}
          <div className="text-center mt-4">
            <button
              onClick={() => setView(VIEWS.SCORES)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to scores
            </button>
          </div>
        </>
      )}

      {/* Character Creator Modal */}
      {creatingCharacterFor && (
        <CharacterCreator
          scaleId={creatingCharacterFor}
          onComplete={() => setCreatingCharacterFor(null)}
          onCancel={() => setCreatingCharacterFor(null)}
        />
      )}
    </div>
  )
}
