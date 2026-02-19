import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import scales from '../data/scales'
import ChatInterface from '../components/ChatInterface'

export default function InteractPage() {
  const navigate = useNavigate()
  const { scores, selectedTraits, apiKey, setApiKey, clearConversation } = useAppStore()
  const [activeTraitId, setActiveTraitId] = useState(null)
  const [showApiSetup, setShowApiSetup] = useState(false)
  const [keyInput, setKeyInput] = useState(apiKey || '')

  // Default to first selected trait
  useEffect(() => {
    if (!activeTraitId && selectedTraits.length > 0) {
      setActiveTraitId(selectedTraits[0])
    }
  }, [selectedTraits, activeTraitId])

  // Check if API key is needed
  useEffect(() => {
    if (!apiKey) {
      setShowApiSetup(true)
    }
  }, [apiKey])

  if (!scores) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-gray-400 mb-4">Complete the assessment first to unlock interactions.</p>
        <button onClick={() => navigate('/test')} className="btn-primary">
          Take the Assessment
        </button>
      </div>
    )
  }

  if (selectedTraits.length === 0) {
    return (
      <div className="page-container text-center py-20">
        <p className="text-gray-400 mb-4">No inner parts selected yet.</p>
        <p className="text-sm text-gray-300 mb-6">
          Go to your results and select the traits you'd like to talk to.
        </p>
        <button onClick={() => navigate('/results')} className="btn-primary">
          View Results &amp; Select Parts
        </button>
      </div>
    )
  }

  const handleSaveKey = () => {
    setApiKey(keyInput.trim())
    setShowApiSetup(false)
  }

  return (
    <div className="h-[calc(100vh-64px-57px)] flex">
      {/* Sidebar — trait list */}
      <div className="w-16 sm:w-56 border-r border-gray-100 bg-white flex flex-col">
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:block">
            Your Parts
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedTraits.map((traitId) => {
            const scale = scales[traitId]
            if (!scale) return null
            const isActive = activeTraitId === traitId

            return (
              <button
                key={traitId}
                onClick={() => setActiveTraitId(traitId)}
                className={`
                  w-full text-left p-3 sm:p-4 border-b border-gray-50 transition-colors
                  ${isActive ? 'bg-calm-50 border-l-2 border-l-calm-500' : 'hover:bg-gray-50'}
                `}
              >
                <div className="sm:hidden text-center">
                  <div className="text-lg">{scale.traitName?.[4] || '?'}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{scale.abbrev}</div>
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-calm-700' : 'text-gray-700'}`}>
                    {scale.traitName || scale.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{scale.abbrev} · T={scores[traitId]?.tScore}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="p-3 border-t border-gray-100 space-y-2">
          <button
            onClick={() => navigate('/results')}
            className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            <span className="hidden sm:inline">+ Add parts</span>
            <span className="sm:hidden">+</span>
          </button>
          <button
            onClick={() => setShowApiSetup(true)}
            className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            <span className="hidden sm:inline">⚙ API Key</span>
            <span className="sm:hidden">⚙</span>
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {showApiSetup ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="card max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Connect to OpenAI
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Stage 3 uses the Anthropic API to bring your inner parts to life.
                Enter your API key to begin conversations.
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Your key is stored locally in your browser and never sent to any server except Anthropic's API.
              </p>

              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm mb-4
                  focus:outline-none focus:ring-2 focus:ring-calm-500 focus:border-transparent
                  placeholder:text-gray-300"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSaveKey}
                  disabled={!keyInput.trim()}
                  className="btn-primary flex-1 disabled:opacity-30"
                >
                  Save &amp; Continue
                </button>
                {apiKey && (
                  <button
                    onClick={() => setShowApiSetup(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-300 mt-4 text-center">
                Get a key at{' '}
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-calm-500 hover:text-calm-600"
                >
                  console.anthropic.com
                </a>
              </p>
            </div>
          </div>
        ) : activeTraitId ? (
          <ChatInterface scaleId={activeTraitId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300">
            <p className="text-sm">Select a part from the sidebar to begin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
