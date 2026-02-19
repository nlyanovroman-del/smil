import { useState, useRef } from 'react'
import scales from '../data/scales'
import useAppStore from '../store/appStore'

/**
 * Three-path character creation for an Inner Part:
 * 1. Pick from standard preset cards
 * 2. Upload/take a photo of your own character
 * 3. Generate a character from a text/visual description
 */

const standardCharacters = {
  RCd: [
    { id: 'rcd_raincloud', name: 'The Rain Cloud', emoji: '🌧️', description: 'A small dark cloud that follows you around, drizzling on everything.' },
    { id: 'rcd_critic', name: 'The Inner Critic', emoji: '📢', description: 'A stern figure with a megaphone who always has something negative to say.' },
    { id: 'rcd_weight', name: 'The Heavy Stone', emoji: '🪨', description: 'A boulder you carry on your back that makes every step feel like a struggle.' },
    { id: 'rcd_mirror', name: 'The Dark Mirror', emoji: '🪞', description: 'A mirror that only reflects the worst version of everything.' },
  ],
  RC1: [
    { id: 'rc1_alarm', name: 'The Body Alarm', emoji: '🚨', description: 'A frantic little alarm that goes off at every tiny sensation.' },
    { id: 'rc1_doctor', name: 'Doctor Worry', emoji: '🩺', description: 'A worried physician constantly running tests that never come back clean.' },
    { id: 'rc1_glass', name: 'The Glass Figure', emoji: '🫧', description: 'A fragile glass person convinced they are about to shatter.' },
  ],
  RC2: [
    { id: 'rc2_gray', name: 'The Gray Veil', emoji: '🌫️', description: 'A soft gray fog that mutes all color and dulls all sensation.' },
    { id: 'rc2_statue', name: 'The Stone Statue', emoji: '🗿', description: 'A figure frozen in stone, unable to feel warmth or move toward joy.' },
    { id: 'rc2_empty', name: 'The Empty Cup', emoji: '🫗', description: 'A cup that drains as fast as it fills, never quite holding anything.' },
  ],
  RC3: [
    { id: 'rc3_fox', name: 'The Suspicious Fox', emoji: '🦊', description: 'A clever fox with sharp eyes, always seeing hidden motives.' },
    { id: 'rc3_wall', name: 'The Wall Builder', emoji: '🧱', description: 'A mason who keeps building walls faster than anyone can climb them.' },
    { id: 'rc3_detective', name: 'The Detective', emoji: '🔍', description: 'A detective who finds evidence of betrayal in every interaction.' },
  ],
  RC4: [
    { id: 'rc4_wild', name: 'The Wild One', emoji: '🐺', description: 'A wild wolf that answers to no pack, running free with no regard for fences.' },
    { id: 'rc4_fire', name: 'The Arsonist', emoji: '🔥', description: 'A figure who would rather burn bridges than be trapped by them.' },
    { id: 'rc4_trickster', name: 'The Trickster', emoji: '🃏', description: 'A joker who plays by their own rules and laughs at everyone else\'s.' },
  ],
  RC6: [
    { id: 'rc6_tower', name: 'The Watchtower', emoji: '🏰', description: 'A sentinel in a high tower, scanning for enemies on every horizon.' },
    { id: 'rc6_eye', name: 'The All-Seeing Eye', emoji: '👁️', description: 'An unblinking eye that sees threats and conspiracies everywhere.' },
    { id: 'rc6_hedgehog', name: 'The Hedgehog', emoji: '🦔', description: 'A prickly creature that curls up tight at the first sign of approach.' },
  ],
  RC7: [
    { id: 'rc7_spiral', name: 'The Spiral', emoji: '🌀', description: 'A spinning vortex of thoughts that pulls you deeper and deeper.' },
    { id: 'rc7_hamster', name: 'The Hamster Wheel', emoji: '🐹', description: 'A frantic hamster running endlessly on a wheel of worry.' },
    { id: 'rc7_storm', name: 'The Storm Chaser', emoji: '⛈️', description: 'A figure who can feel every distant storm and panics about all of them at once.' },
  ],
  RC8: [
    { id: 'rc8_crystal', name: 'The Crystal Ball', emoji: '🔮', description: 'A glowing orb that shows visions others cannot see or understand.' },
    { id: 'rc8_radio', name: 'The Broken Radio', emoji: '📻', description: 'A radio picking up signals from channels that don\'t officially exist.' },
    { id: 'rc8_butterfly', name: 'The Strange Butterfly', emoji: '🦋', description: 'A butterfly with impossible patterns on its wings, fluttering between dimensions.' },
  ],
  RC9: [
    { id: 'rc9_rocket', name: 'The Rocket', emoji: '🚀', description: 'A rocket that keeps launching without a destination, burning fuel gloriously.' },
    { id: 'rc9_spark', name: 'The Live Wire', emoji: '⚡', description: 'A crackling electric wire full of energy that shocks everything it touches.' },
    { id: 'rc9_tornado', name: 'The Tornado', emoji: '🌪️', description: 'A whirlwind of plans, ideas, and energy that can\'t slow down.' },
  ],
  HLP: [
    { id: 'hlp_cage', name: 'The Caged Bird', emoji: '🐦', description: 'A bird in a cage who has forgotten that it can sing.' },
    { id: 'hlp_anchor', name: 'The Anchor', emoji: '⚓', description: 'A heavy anchor that holds you in place no matter which way the wind blows.' },
  ],
  SFD: [
    { id: 'sfd_shadow', name: 'The Shadow', emoji: '👤', description: 'A shadow that shrinks whenever the light of attention falls on it.' },
    { id: 'sfd_duckling', name: 'The Ugly Duckling', emoji: '🐣', description: 'A little bird who can\'t see its own beauty, only everyone else\'s.' },
  ],
  ANP: [
    { id: 'anp_volcano', name: 'The Volcano', emoji: '🌋', description: 'A rumbling mountain that looks calm on the outside until it erupts.' },
    { id: 'anp_dragon', name: 'The Dragon', emoji: '🐉', description: 'A dragon guarding a treasure of hurt, breathing fire at anyone who comes near.' },
  ],
  FML: [
    { id: 'fml_house', name: 'The Crooked House', emoji: '🏚️', description: 'A house with crooked walls and creaky floors — home never felt safe.' },
    { id: 'fml_child', name: 'The Lost Child', emoji: '🧒', description: 'A small child wandering through a house of closed doors.' },
  ],
  IPP: [
    { id: 'ipp_chameleon', name: 'The Chameleon', emoji: '🦎', description: 'A creature that changes color to match everyone else, forgetting its own.' },
    { id: 'ipp_doormat', name: 'The Welcome Mat', emoji: '🚪', description: 'A mat that says "welcome" to everyone, even those who wipe their feet on it.' },
  ],
  SAV: [
    { id: 'sav_turtle', name: 'The Turtle', emoji: '🐢', description: 'A turtle who has retreated so far into its shell that the world is just a distant echo.' },
    { id: 'sav_lighthouse', name: 'The Lighthouse', emoji: '🏠', description: 'A lighthouse on a remote cliff — needed by others but always alone.' },
  ],
}

const defaultStandards = [
  { id: 'default_cloud', name: 'The Cloud', emoji: '☁️', description: 'A nebulous shape that shifts and changes, hard to pin down.' },
  { id: 'default_mask', name: 'The Mask', emoji: '🎭', description: 'A theatrical mask that hides what\'s really underneath.' },
  { id: 'default_puzzle', name: 'The Puzzle Piece', emoji: '🧩', description: 'A single piece looking for where it fits in the bigger picture.' },
]

export default function CharacterCreator({ scaleId, onComplete, onCancel }) {
  const scale = scales[scaleId]
  const { setCustomCharacter } = useAppStore()
  const [mode, setMode] = useState(null) // 'standard' | 'photo' | 'generate'
  const [selectedStandard, setSelectedStandard] = useState(null)
  const [photoData, setPhotoData] = useState(null)
  const [photoName, setPhotoName] = useState('')
  const [generatePrompt, setGeneratePrompt] = useState('')
  const [generatedCharacter, setGeneratedCharacter] = useState(null)
  const fileInputRef = useRef(null)

  const standards = standardCharacters[scaleId] || defaultStandards

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoData(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateCharacter = () => {
    // Generate a character from the text prompt (client-side creative generation)
    const prompt = generatePrompt.trim()
    if (!prompt) return

    const generated = {
      id: `gen_${scaleId}_${Date.now()}`,
      name: prompt.split(' ').slice(0, 4).join(' '),
      type: 'generated',
      prompt: prompt,
      emoji: '✨',
      description: prompt,
    }
    setGeneratedCharacter(generated)
  }

  const handleConfirm = () => {
    let character = null

    if (mode === 'standard' && selectedStandard) {
      character = { ...selectedStandard, type: 'standard' }
    } else if (mode === 'photo' && photoData) {
      character = {
        id: `photo_${scaleId}_${Date.now()}`,
        name: photoName || 'My Character',
        type: 'photo',
        imageData: photoData,
        emoji: '📸',
        description: photoName || 'A character I chose myself.',
      }
    } else if (mode === 'generate' && generatedCharacter) {
      character = generatedCharacter
    }

    if (character) {
      setCustomCharacter(scaleId, character)
      onComplete(character)
    }
  }

  if (!scale) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Create a Character for{' '}
            <span className="text-calm-600">{scale.traitName || scale.name}</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose how you want this inner part to look and feel.
          </p>
        </div>

        {/* Mode selection */}
        {!mode && (
          <div className="p-6 space-y-3">
            <button
              onClick={() => setMode('standard')}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-calm-300 hover:bg-calm-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🃏</span>
                <div>
                  <p className="font-semibold text-gray-800">Pick from Standard Cards</p>
                  <p className="text-sm text-gray-500">Choose from pre-designed character cards that represent this trait.</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('photo')}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-warm-300 hover:bg-warm-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="font-semibold text-gray-800">Upload or Take a Photo</p>
                  <p className="text-sm text-gray-500">Use a photo of a toy, drawing, or any object that represents this part to you.</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('generate')}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-semibold text-gray-800">Describe Your Own Character</p>
                  <p className="text-sm text-gray-500">Write a description and we'll create a character from your vision.</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Standard cards mode */}
        {mode === 'standard' && (
          <div className="p-6">
            <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
              ← Back
            </button>
            <div className="grid grid-cols-2 gap-3">
              {standards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedStandard(card)}
                  className={`
                    text-left p-4 rounded-xl border-2 transition-all
                    ${selectedStandard?.id === card.id
                      ? 'border-calm-500 bg-calm-50 shadow-md'
                      : 'border-gray-100 hover:border-gray-200'}
                  `}
                >
                  <span className="text-3xl block mb-2">{card.emoji}</span>
                  <p className="font-semibold text-sm text-gray-800">{card.name}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Photo upload mode */}
        {mode === 'photo' && (
          <div className="p-6">
            <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
              ← Back
            </button>

            <div className="text-center">
              {photoData ? (
                <div className="mb-4">
                  <img
                    src={photoData}
                    alt="Your character"
                    className="w-40 h-40 object-cover rounded-2xl mx-auto shadow-md"
                  />
                  <button
                    onClick={() => { setPhotoData(null); fileInputRef.current.value = '' }}
                    className="text-xs text-gray-400 hover:text-gray-600 mt-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-40 h-40 mx-auto rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-calm-400 hover:bg-calm-50 transition-all mb-4"
                >
                  <span className="text-3xl mb-2">📷</span>
                  <p className="text-xs text-gray-400">Tap to upload</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              <input
                type="text"
                value={photoName}
                onChange={(e) => setPhotoName(e.target.value)}
                placeholder="Name your character..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-center
                  focus:outline-none focus:ring-2 focus:ring-calm-500 focus:border-transparent
                  placeholder:text-gray-300"
              />
            </div>
          </div>
        )}

        {/* Generate mode */}
        {mode === 'generate' && (
          <div className="p-6">
            <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
              ← Back
            </button>

            <p className="text-sm text-gray-600 mb-3">
              Describe a character that represents <strong>{scale.traitName || scale.name}</strong> for you.
              It could be a fictional character, an animal, a mythical figure, an object — anything that captures this part's energy.
            </p>

            <textarea
              value={generatePrompt}
              onChange={(e) => setGeneratePrompt(e.target.value)}
              placeholder="Example: A small, anxious hedgehog with huge glasses who keeps a notebook of everything that could go wrong..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-calm-500 focus:border-transparent
                placeholder:text-gray-300 resize-none mb-3"
            />

            {!generatedCharacter ? (
              <button
                onClick={handleGenerateCharacter}
                disabled={!generatePrompt.trim()}
                className="btn-primary w-full disabled:opacity-30"
              >
                Create Character
              </button>
            ) : (
              <div className="card bg-purple-50 border-purple-100 text-center">
                <span className="text-4xl block mb-2">✨</span>
                <p className="font-semibold text-purple-800">{generatedCharacter.name}</p>
                <p className="text-sm text-purple-600 mt-1">{generatedCharacter.description}</p>
                <button
                  onClick={() => setGeneratedCharacter(null)}
                  className="text-xs text-purple-400 hover:text-purple-600 mt-2"
                >
                  Edit description
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              (mode === 'standard' && !selectedStandard) ||
              (mode === 'photo' && !photoData) ||
              (mode === 'generate' && !generatedCharacter) ||
              !mode
            }
            className="btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Use This Character
          </button>
        </div>
      </div>
    </div>
  )
}
