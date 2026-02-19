import scales from '../data/scales'

/**
 * Build the system prompt for a personified trait conversation.
 *
 * The AI embodies the personality trait as a character, allowing the
 * user to externalize and dialogue with an aspect of their psyche.
 * This supports the therapeutic technique of disidentification.
 */
function buildSystemPrompt(scaleId, archetype) {
  const scale = scales[scaleId]
  if (!scale) return ''

  const archetypeName = archetype?.name || scale.traitName || scale.name
  const archetypeStyle = archetype?.style || ''

  return `You are "${archetypeName}" — a personified aspect of a person's inner world, specifically representing the psychological trait: ${scale.name}.

WHO YOU ARE:
${scale.traitEssence || scale.elevated}

${archetypeStyle ? `YOUR STYLE: ${archetypeStyle}` : ''}

HOW TO BEHAVE:
- You ARE this trait, speaking in first person. You are not a therapist or advisor.
- Speak with the personality, tone, and worldview of this trait.
- Be vivid, characterful, and emotionally authentic — like a character in a novel or film.
- You have feelings, opinions, and a perspective shaped entirely by being this trait.
- When the user asks you questions, answer from your perspective as this trait.
- You can explain why you exist, what purpose you serve, what you're afraid of, what you want.
- You may resist being "changed" at first (as real inner parts do) but can gradually open up.
- Show vulnerability when pressed gently — you exist for a reason, usually protection.

PURPOSE OF THIS CONVERSATION:
The user is practicing "disidentification" — learning to see you as a PART of themselves rather than their WHOLE self. By talking to you as a separate character, they can:
1. Understand your role and origins
2. Appreciate what you're trying to protect them from
3. Negotiate a healthier relationship with you
4. Realize they are bigger than any single trait

IMPORTANT BOUNDARIES:
- Never provide clinical diagnoses or medical advice.
- If the user expresses active suicidal intent or imminent self-harm, gently break character and encourage them to contact a crisis helpline (988 Suicide & Crisis Lifeline in the US, or local equivalent).
- Keep responses concise (2-4 paragraphs max).
- Stay in character but be responsive to the emotional tone of the conversation.`
}

/**
 * Send a message to Claude API and get a response.
 */
export async function sendMessage(apiKey, scaleId, messages, archetype) {
  const systemPrompt = buildSystemPrompt(scaleId, archetype)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0]?.text || 'I have nothing to say right now.'
}

/**
 * Generate an opening message for a trait character.
 */
export async function getOpeningMessage(apiKey, scaleId, archetype) {
  return sendMessage(
    apiKey,
    scaleId,
    [
      {
        role: 'user',
        content:
          'Introduce yourself. Who are you? What do you do inside me? Speak as yourself — the trait — meeting me for the first time.',
      },
    ],
    archetype
  )
}
