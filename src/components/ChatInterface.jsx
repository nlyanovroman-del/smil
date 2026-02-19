import { useState, useRef, useEffect } from 'react'
import useAppStore from '../store/appStore'
import { sendMessage, getOpeningMessage } from '../utils/openai'
import scales from '../data/scales'
import archetypeTemplates from '../data/archetypes'

export default function ChatInterface({ scaleId }) {
  const scale = scales[scaleId]
  const { apiKey, conversations, addMessage, customCharacters } = useAppStore()
  const messages = conversations[scaleId] || []
  const customCharacter = customCharacters[scaleId]

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [archetype, setArchetype] = useState(archetypeTemplates[0])
  const [showArchetypes, setShowArchetypes] = useState(messages.length === 0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getApiMessages = () => {
    return messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))
  }

  const handleStartConversation = async () => {
    setShowArchetypes(false)
    setLoading(true)
    setError(null)

    try {
      const response = await getOpeningMessage(apiKey, scaleId, archetype, customCharacter)
      addMessage(scaleId, {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError(null)

    addMessage(scaleId, {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    })

    setLoading(true)

    try {
      const apiMessages = [
        ...getApiMessages(),
        { role: 'user', content: text },
      ]
      const response = await sendMessage(apiKey, scaleId, apiMessages, archetype, customCharacter)
      addMessage(scaleId, {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Conversation starters
  const starters = [
    'Why do you exist? What are you protecting me from?',
    'When did you first show up in my life?',
    'What are you most afraid of?',
    'What would you want me to know about you?',
    'What happens when I try to ignore you?',
  ]

  if (!scale) return null

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        {customCharacter?.type === 'photo' && customCharacter.imageData ? (
          <img src={customCharacter.imageData} alt={customCharacter.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-calm-400 to-calm-600 flex items-center justify-center text-white text-lg">
            {customCharacter?.emoji || scale.traitName?.[4] || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {customCharacter?.name || scale.traitName || scale.name}
          </h3>
          <p className="text-xs text-gray-400 truncate">
            {archetype.label} · {scale.abbrev}
          </p>
        </div>
        <button
          onClick={() => setShowArchetypes(true)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Change style
        </button>
      </div>

      {/* Archetype selection */}
      {showArchetypes && (
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">
            How should this part appear to you?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {archetypeTemplates.map((a) => (
              <button
                key={a.id}
                onClick={() => setArchetype(a)}
                className={`
                  text-left p-3 rounded-xl border-2 transition-all
                  ${archetype.id === a.id
                    ? 'border-calm-500 bg-calm-50'
                    : 'border-gray-100 bg-white hover:border-gray-200'}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{a.icon}</span>
                  <span className="text-sm font-medium text-gray-800">{a.label}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{a.description}</p>
              </button>
            ))}
          </div>
          <button
            onClick={handleStartConversation}
            disabled={loading}
            className="btn-primary w-full mt-3"
          >
            {loading ? 'Summoning...' : `Begin as ${archetype.label}`}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !showArchetypes && (
          <div className="text-center text-gray-300 py-8">
            <p className="text-sm">Choose a character style above to begin.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`animate-fade-in-up flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-calm-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'}
              `}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-soft" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-soft" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2 inline-block">
              {error}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Conversation starters */}
      {messages.length > 0 && messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-300 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-1.5">
            {starters.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(s)
                  inputRef.current?.focus()
                }}
                className="text-xs bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full hover:bg-calm-50 hover:text-calm-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {messages.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Say something to this part of you..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-calm-500 focus:border-transparent
                placeholder:text-gray-300"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="btn-primary px-4 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
