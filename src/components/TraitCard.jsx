import { useState } from 'react'

/**
 * Visual "Inner Part" card — inspired by Inner Active Cards.
 * Each elevated trait is represented as a vivid character card
 * with color, icon, personality description, and interaction hooks.
 */

const traitVisuals = {
  RCd: {
    emoji: '🌧️',
    gradient: 'from-slate-400 to-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    accent: 'text-slate-700',
    illustration: 'A figure sitting in the rain, looking down at gray puddles that reflect a cloudless sky they cannot see.',
  },
  RC1: {
    emoji: '🩺',
    gradient: 'from-emerald-400 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-700',
    illustration: 'A figure wrapped in bandages, pressing a stethoscope to their own chest, eyes wide with worry.',
  },
  RC2: {
    emoji: '🪨',
    gradient: 'from-gray-400 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    accent: 'text-gray-600',
    illustration: 'A figure made of stone, standing in a garden of colorful flowers that they cannot smell or feel.',
  },
  RC3: {
    emoji: '🦊',
    gradient: 'from-amber-400 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'text-amber-700',
    illustration: 'A fox with narrowed eyes, peering around a corner, seeing shadows and hidden motives everywhere.',
  },
  RC4: {
    emoji: '⚡',
    gradient: 'from-red-400 to-rose-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    accent: 'text-red-700',
    illustration: 'A wild-haired figure breaking chains, laughing, with scattered rule-books at their feet.',
  },
  RC6: {
    emoji: '👁️',
    gradient: 'from-violet-400 to-purple-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    accent: 'text-violet-700',
    illustration: 'A figure in a watchtower, surrounded by eyes, scanning the horizon for threats only they can see.',
  },
  RC7: {
    emoji: '🌀',
    gradient: 'from-blue-400 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-700',
    illustration: 'A figure caught in a spiral of spinning thoughts, hands clutching their head, winds swirling around them.',
  },
  RC8: {
    emoji: '🔮',
    gradient: 'from-fuchsia-400 to-purple-600',
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-200',
    accent: 'text-fuchsia-700',
    illustration: 'A figure with kaleidoscope eyes, seeing patterns and connections in the air that others walk right through.',
  },
  RC9: {
    emoji: '🚀',
    gradient: 'from-orange-400 to-red-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'text-orange-700',
    illustration: 'A figure riding a rocket, arms spread wide, grinning wildly, trailing sparks and half-finished plans.',
  },
  HLP: {
    emoji: '🏚️',
    gradient: 'from-stone-400 to-stone-600',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
    accent: 'text-stone-700',
    illustration: 'A figure locked in a tower with no door, staring out a tiny window at a world moving on without them.',
  },
  SFD: {
    emoji: '🪞',
    gradient: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    accent: 'text-sky-700',
    illustration: 'A figure looking in a funhouse mirror that makes them small, while everyone else\'s reflections look tall.',
  },
  ANP: {
    emoji: '🔥',
    gradient: 'from-red-500 to-orange-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    accent: 'text-red-700',
    illustration: 'A figure wreathed in flames, fists clenched, embers floating from their eyes at the smallest slight.',
  },
  FML: {
    emoji: '🏠',
    gradient: 'from-rose-400 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    accent: 'text-rose-700',
    illustration: 'A small figure standing before a crooked house, holding a cracked family photograph to their chest.',
  },
  IPP: {
    emoji: '🎭',
    gradient: 'from-teal-400 to-cyan-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    accent: 'text-teal-700',
    illustration: 'A figure wearing a permanent smile mask, hands outstretched offering everything, pockets empty.',
  },
  SAV: {
    emoji: '🏔️',
    gradient: 'from-cyan-400 to-blue-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    accent: 'text-cyan-700',
    illustration: 'A figure on a distant mountaintop, watching the village lights below through a telescope they never put down.',
  },
}

const defaultVisual = {
  emoji: '💠',
  gradient: 'from-gray-400 to-gray-600',
  bg: 'bg-gray-50',
  border: 'border-gray-200',
  accent: 'text-gray-700',
  illustration: 'An inner part waiting to be understood.',
}

export default function TraitCard({ scale, customCharacter, isSelected, onToggle, onInteract, onCustomize }) {
  const [flipped, setFlipped] = useState(false)
  const visual = traitVisuals[scale.id] || defaultVisual
  const hasCustom = !!customCharacter

  const tScoreLabel =
    scale.tScore >= 85 ? 'Very High' :
    scale.tScore >= 75 ? 'High' :
    scale.tScore >= 65 ? 'Elevated' : 'Notable'

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
        border-2 ${isSelected ? 'border-calm-500 shadow-lg shadow-calm-100' : `${visual.border} hover:shadow-md`}
      `}
      onClick={() => setFlipped(!flipped)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-calm-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}

      {!flipped ? (
        /* FRONT — Visual card face */
        <div className={`${visual.bg} p-6`}>
          {/* Trait emoji / custom image and T-score badge */}
          <div className="flex items-start justify-between mb-4">
            {hasCustom && customCharacter.type === 'photo' && customCharacter.imageData ? (
              <img src={customCharacter.imageData} alt={customCharacter.name} className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <span className="text-4xl">{hasCustom ? (customCharacter.emoji || visual.emoji) : visual.emoji}</span>
            )}
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-bold
              ${scale.tScore >= 85 ? 'bg-red-100 text-red-700' :
                scale.tScore >= 75 ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'}
            `}>
              T={scale.tScore} · {tScoreLabel}
            </span>
          </div>

          {/* Trait name (custom or default) */}
          <h3 className={`text-lg font-bold ${visual.accent} mb-1`}>
            {hasCustom ? customCharacter.name : (scale.traitName || scale.name)}
          </h3>
          <p className="text-xs text-gray-400 mb-3">{scale.abbrev} — {scale.name}</p>

          {/* Illustration description */}
          <p className="text-sm text-gray-500 italic leading-relaxed mb-4">
            "{hasCustom ? customCharacter.description : visual.illustration}"
          </p>

          {/* Flip hint */}
          <p className="text-xs text-gray-300 text-center">tap to learn more</p>
        </div>
      ) : (
        /* BACK — Details and actions */
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{visual.emoji}</span>
            <h3 className={`font-bold ${visual.accent}`}>
              {scale.traitName || scale.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {scale.traitEssence || scale.elevated}
          </p>

          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            {scale.description}
          </p>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle(scale.id)
              }}
              className={`
                flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                ${isSelected
                  ? 'bg-calm-100 text-calm-700 hover:bg-calm-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {isSelected ? '✓ Selected' : 'Select'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onInteract(scale.id)
              }}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-warm-100 text-warm-700 hover:bg-warm-200 transition-colors"
            >
              Talk →
            </button>
          </div>

          {/* Customize character button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCustomize && onCustomize()
            }}
            className="w-full mt-2 py-1.5 rounded-lg text-xs font-medium text-purple-500 hover:bg-purple-50 transition-colors"
          >
            {hasCustom ? '✏ Change character' : '✨ Customize character'}
          </button>

          <p className="text-xs text-gray-300 text-center mt-2">tap to flip back</p>
        </div>
      )}

      {/* Bottom gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${visual.gradient}`} />
    </div>
  )
}
