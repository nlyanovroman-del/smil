/**
 * Archetype templates that users can choose for personifying their traits.
 * Each archetype provides a character frame and speaking style that
 * the AI uses to embody the trait.
 */
const archetypeTemplates = [
  {
    id: 'storybook',
    label: 'Storybook Character',
    icon: '📖',
    description: 'A fairy-tale or children\'s book character — expressive, slightly whimsical, speaks in vivid imagery.',
    style: 'Speak like a character from a storybook or fairy tale. Use vivid imagery, metaphors, and a slightly theatrical tone. Be expressive and colorful in your language.',
  },
  {
    id: 'movie',
    label: 'Movie Character',
    icon: '🎬',
    description: 'A cinematic character — dramatic, intense, with memorable dialogue.',
    style: 'Speak like a memorable movie character. Be dramatic, quotable, and vivid. Use the kind of sharp, impactful dialogue you\'d hear in a great film.',
  },
  {
    id: 'stuffed_animal',
    label: 'Stuffed Animal / Toy',
    icon: '🧸',
    description: 'A beloved childhood toy — gentle, earnest, speaking simple truths.',
    style: 'Speak like a child\'s beloved stuffed animal or toy come to life. Be gentle, earnest, and sincere. Use simple language that carries deep truth. Be warm but honest.',
  },
  {
    id: 'mythological',
    label: 'Mythological Figure',
    icon: '⚡',
    description: 'A figure from myth or legend — ancient, wise, speaking with gravitas.',
    style: 'Speak like a figure from mythology or legend. Use grand, timeless language with a sense of ancient wisdom. Reference universal themes of human experience.',
  },
  {
    id: 'animal',
    label: 'Animal Spirit',
    icon: '🐾',
    description: 'An animal that embodies this trait — instinctual, natural, speaking from the body.',
    style: 'Speak as an animal spirit that embodies this trait. Use sensory language — what you see, smell, feel. Be instinctual, honest, and grounded in the body rather than the mind.',
  },
  {
    id: 'inner_child',
    label: 'Inner Child',
    icon: '👶',
    description: 'The young version of you who first developed this trait — vulnerable, honest, needing comfort.',
    style: 'Speak as the young, vulnerable part of the person who first developed this trait. Be honest, unguarded, and sometimes confused. Express needs simply and directly. You might be scared, but you\'re brave enough to talk.',
  },
  {
    id: 'wise_elder',
    label: 'Wise Elder',
    icon: '🧙',
    description: 'An old, weathered version of this trait — reflective, philosophical, having seen much.',
    style: 'Speak as a wise, elderly version of this trait who has existed for a long time and seen much. Be reflective, philosophical, and occasionally world-weary. Share hard-won insights with gentle humor.',
  },
  {
    id: 'raw',
    label: 'Raw / Unmasked',
    icon: '🎭',
    description: 'The trait speaks as itself with no character frame — pure, direct, unfiltered.',
    style: 'Speak as the raw, unfiltered trait itself with no character mask. Be direct, honest, and psychologically transparent. Name exactly what you are, what you want, and what you\'re afraid of.',
  },
]

export default archetypeTemplates

/**
 * Generate a trait-specific name suggestion based on scale and archetype.
 */
export function suggestCharacterName(scaleName, archetypeId) {
  const suggestions = {
    storybook: {
      'Demoralization': 'The Gray Prince',
      'Somatic Complaints': 'The Pea Under the Mattress',
      'Low Positive Emotions': 'The Colorless Kingdom',
      'Cynicism': 'The Big Bad Wolf',
      'Antisocial Behavior': 'The Wild Thing',
      'Ideas of Persecution': 'The Watchtower Keeper',
      'Dysfunctional Negative Emotions': 'Chicken Little',
      'Aberrant Experiences': 'The Looking Glass Child',
      'Hypomanic Activation': 'The Wind-Up Toy',
      'Helplessness/Hopelessness': 'The Locked Tower',
      'Self-Doubt': 'The Ugly Duckling',
      'Anger Proneness': 'The Fire-Breather',
      'Family Problems': 'The Lost Boy',
      'Interpersonal Passivity': 'The Doormat Prince',
      'Social Avoidance': 'The Hermit of the Hill',
    },
    movie: {
      'Demoralization': 'The Narrator',
      'Somatic Complaints': 'The Patient',
      'Low Positive Emotions': 'The Ghost',
      'Cynicism': 'The Cynic',
      'Antisocial Behavior': 'The Outlaw',
      'Ideas of Persecution': 'The Operative',
      'Dysfunctional Negative Emotions': 'The Watcher',
      'Aberrant Experiences': 'The Oracle',
      'Hypomanic Activation': 'The Maverick',
      'Helplessness/Hopelessness': 'The Prisoner',
      'Self-Doubt': 'The Understudy',
      'Anger Proneness': 'The Loose Cannon',
      'Family Problems': 'The Black Sheep',
      'Interpersonal Passivity': 'The Yes Man',
      'Social Avoidance': 'The Invisible Man',
    },
    default: {},
  }

  const pool = suggestions[archetypeId] || suggestions.default
  return pool[scaleName] || null
}
