import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import questions from '../data/questions'
import { scoreAssessment } from '../utils/scoring'
import ProgressBar from '../components/ProgressBar'

const TOTAL = questions.length

export default function TestPage() {
  const navigate = useNavigate()
  const { answers, currentQuestion, setAnswer, setCurrentQuestion, setScores } = useAppStore()
  const [direction, setDirection] = useState('forward')

  const answered = Object.keys(answers).length
  const question = questions[currentQuestion]
  const currentAnswer = answers[question?.id]
  const isComplete = answered === TOTAL

  const goTo = useCallback((index, dir = 'forward') => {
    if (index >= 0 && index < TOTAL) {
      setDirection(dir)
      setCurrentQuestion(index)
    }
  }, [setCurrentQuestion])

  const handleAnswer = useCallback((value) => {
    setAnswer(question.id, value)
    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestion < TOTAL - 1) {
        goTo(currentQuestion + 1)
      }
    }, 200)
  }, [question, currentQuestion, setAnswer, goTo])

  const handleFinish = () => {
    const scores = scoreAssessment(answers)
    setScores(scores)
    navigate('/results')
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goTo(currentQuestion - 1, 'backward')
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goTo(currentQuestion + 1)
      } else if (e.key === 't' || e.key === 'T' || e.key === '1') {
        handleAnswer(true)
      } else if (e.key === 'f' || e.key === 'F' || e.key === '2') {
        handleAnswer(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentQuestion, handleAnswer, goTo])

  if (!question) return null

  return (
    <div className="page-container max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestion + 1} of {TOTAL}
          </span>
          <span className="text-sm text-gray-400">
            {answered} answered ({Math.round((answered / TOTAL) * 100)}%)
          </span>
        </div>
        <ProgressBar value={answered} max={TOTAL} />
      </div>

      {/* Question Card */}
      <div className="card mb-6">
        <div className="min-h-[120px] flex items-center justify-center">
          <p className="text-lg md:text-xl text-gray-800 text-center leading-relaxed font-medium">
            "{question.text}"
          </p>
        </div>

        {/* Answer Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => handleAnswer(true)}
            className={`
              flex-1 py-4 rounded-xl text-lg font-semibold transition-all duration-200
              ${currentAnswer === true
                ? 'bg-green-500 text-white shadow-lg shadow-green-200 scale-[1.02]'
                : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
              }
            `}
          >
            True
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className={`
              flex-1 py-4 rounded-xl text-lg font-semibold transition-all duration-200
              ${currentAnswer === false
                ? 'bg-red-400 text-white shadow-lg shadow-red-200 scale-[1.02]'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
              }
            `}
          >
            False
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goTo(currentQuestion - 1, 'backward')}
          disabled={currentQuestion === 0}
          className="btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          {/* Jump to question */}
          <input
            type="number"
            min={1}
            max={TOTAL}
            value={currentQuestion + 1}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (val >= 1 && val <= TOTAL) {
                goTo(val - 1)
              }
            }}
            className="w-16 text-center text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-calm-500"
          />
          <span className="text-xs text-gray-400">/ {TOTAL}</span>
        </div>

        {currentQuestion < TOTAL - 1 ? (
          <button
            onClick={() => goTo(currentQuestion + 1)}
            className="btn-secondary text-sm"
          >
            Next →
          </button>
        ) : (
          <div /> /* spacer */
        )}
      </div>

      {/* Finish button */}
      {isComplete && (
        <div className="mt-8 text-center">
          <button onClick={handleFinish} className="btn-primary text-lg px-10 py-4">
            View My Results →
          </button>
        </div>
      )}

      {/* Quick finish for partially complete */}
      {!isComplete && answered > 0 && (
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 mb-2">
            {TOTAL - answered} questions remaining
          </p>
          {answered >= Math.floor(TOTAL * 0.75) && (
            <button
              onClick={handleFinish}
              className="text-sm text-calm-600 hover:text-calm-700 underline"
            >
              Score with current answers ({answered}/{TOTAL})
            </button>
          )}
        </div>
      )}

      {/* Keyboard hints */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-300">
          Keyboard: T = True, F = False, ←→ = Navigate
        </p>
      </div>
    </div>
  )
}
