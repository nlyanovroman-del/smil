import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // Stage 1: Test answers (questionId -> true/false)
      answers: {},
      currentQuestion: 0,

      // Stage 2: Computed scores
      scores: null,

      // Stage 2.5: Custom character representations for traits
      customCharacters: {},

      // Stage 3: Selected traits and chat
      selectedTraits: [],
      conversations: {},
      apiKey: '',

      // Actions — Stage 1
      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      setCurrentQuestion: (index) =>
        set({ currentQuestion: index }),

      // Actions — Stage 2
      setScores: (scores) =>
        set({ scores }),

      // Actions — Stage 2.5: Custom characters
      setCustomCharacter: (scaleId, character) =>
        set((state) => ({
          customCharacters: { ...state.customCharacters, [scaleId]: character },
        })),

      // Actions — Stage 3
      setSelectedTraits: (traits) =>
        set({ selectedTraits: traits }),

      toggleTrait: (scaleId) =>
        set((state) => {
          const current = state.selectedTraits
          if (current.includes(scaleId)) {
            return { selectedTraits: current.filter((t) => t !== scaleId) }
          }
          return { selectedTraits: [...current, scaleId] }
        }),

      setApiKey: (key) =>
        set({ apiKey: key }),

      addMessage: (scaleId, message) =>
        set((state) => ({
          conversations: {
            ...state.conversations,
            [scaleId]: [...(state.conversations[scaleId] || []), message],
          },
        })),

      clearConversation: (scaleId) =>
        set((state) => ({
          conversations: {
            ...state.conversations,
            [scaleId]: [],
          },
        })),

      // Reset
      resetTest: () =>
        set({
          answers: {},
          currentQuestion: 0,
          scores: null,
          customCharacters: {},
          selectedTraits: [],
          conversations: {},
        }),
    }),
    {
      name: 'smil-storage',
      partialize: (state) => ({
        answers: state.answers,
        currentQuestion: state.currentQuestion,
        scores: state.scores,
        customCharacters: state.customCharacters,
        selectedTraits: state.selectedTraits,
        conversations: state.conversations,
        apiKey: state.apiKey,
      }),
    }
  )
)

export default useAppStore
