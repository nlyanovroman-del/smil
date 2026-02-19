import questions from '../data/questions'
import scales from '../data/scales'

/**
 * Calculate raw scores from answers.
 * For each scale, count how many items the respondent answered
 * in the keyed direction.
 */
export function calculateRawScores(answers) {
  const rawScores = {}

  // Initialize all scales to 0
  for (const scaleId of Object.keys(scales)) {
    rawScores[scaleId] = 0
  }

  // Count keyed responses
  for (const question of questions) {
    const answer = answers[question.id]
    if (answer === undefined) continue

    for (const mapping of question.scales) {
      const keyed = mapping.direction === 'true'
      if (answer === keyed) {
        rawScores[mapping.scale] = (rawScores[mapping.scale] || 0) + 1
      }
    }
  }

  return rawScores
}

/**
 * Get the maximum possible raw score for each scale.
 */
export function getMaxRawScores() {
  const maxScores = {}

  for (const scaleId of Object.keys(scales)) {
    maxScores[scaleId] = 0
  }

  for (const question of questions) {
    for (const mapping of question.scales) {
      maxScores[mapping.scale] = (maxScores[mapping.scale] || 0) + 1
    }
  }

  return maxScores
}

/**
 * Convert raw scores to T-scores.
 *
 * Uses a simplified linear transformation:
 * - Mean raw score is assumed at ~35% of max (general population baseline)
 * - 1 SD is ~18% of max
 * - T-score = 50 + ((raw - mean) / sd) * 10
 *
 * This is a simplified approximation. The real MMPI-2-RF uses
 * normative lookup tables from a standardization sample.
 */
export function rawToTScores(rawScores) {
  const maxScores = getMaxRawScores()
  const tScores = {}

  for (const [scaleId, raw] of Object.entries(rawScores)) {
    const max = maxScores[scaleId] || 1
    const mean = max * 0.35
    const sd = max * 0.18

    if (sd === 0) {
      tScores[scaleId] = 50
    } else {
      const tScore = 50 + ((raw - mean) / sd) * 10
      // Clamp between 30 and 120
      tScores[scaleId] = Math.round(Math.min(120, Math.max(30, tScore)))
    }
  }

  return tScores
}

/**
 * Full scoring pipeline: answers -> T-scores with metadata.
 */
export function scoreAssessment(answers) {
  const rawScores = calculateRawScores(answers)
  const tScores = rawToTScores(rawScores)
  const maxScores = getMaxRawScores()

  const results = {}

  for (const [scaleId, scale] of Object.entries(scales)) {
    results[scaleId] = {
      ...scale,
      rawScore: rawScores[scaleId] || 0,
      maxRaw: maxScores[scaleId] || 0,
      tScore: tScores[scaleId] || 50,
    }
  }

  return results
}

/**
 * Get elevated scales (T >= threshold) sorted by T-score descending.
 */
export function getElevatedScales(scores, threshold = 65) {
  return Object.values(scores)
    .filter((s) => s.tScore >= threshold && s.category !== 'validity' && s.category !== 'interest')
    .sort((a, b) => b.tScore - a.tScore)
}

/**
 * Get personifiable elevated scales for Stage 3.
 */
export function getPersonifiableElevated(scores, threshold = 65) {
  return Object.values(scores)
    .filter((s) => s.tScore >= threshold && s.personifiable)
    .sort((a, b) => b.tScore - a.tScore)
}
