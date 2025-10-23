import type { Milestone, EvidenceCard } from './types';

export const milestones: Milestone[] = [
  {
    day: 1,
    title: 'Getting Started',
    note: 'Skin may feel the same. Focus on building consistency with your routine.',
  },
  {
    day: 7,
    title: 'First Week',
    note: 'You might notice slight improvements in hydration. Keep going, no rushing.',
  },
  {
    day: 28,
    title: 'First Month',
    note: 'First cycle checkpoint. Small gains are more likely now. Only adjust if you experience persistent irritation.',
  },
  {
    day: 56,
    title: 'Two Months',
    note: 'Trend check time. Compare photos in similar lighting to track progress.',
  },
  {
    day: 90,
    title: 'Three Months',
    note: 'Outcome review. Evaluate your results and consider targeted additions if goals are unmet.',
  },
];

export function generateMockEvidence(claim: string, userSensitivity: string): EvidenceCard {
  const confidenceMap: { [key: string]: number } = {
    retinol: 85,
    vitamin: 75,
    hyaluronic: 90,
    niacinamide: 80,
    ceramide: 88,
    spf: 95,
    sunscreen: 95,
  };

  let confidence = 65;
  const lowerClaim = claim.toLowerCase();

  for (const [key, value] of Object.entries(confidenceMap)) {
    if (lowerClaim.includes(key)) {
      confidence = value;
      break;
    }
  }

  const applicability =
    userSensitivity === 'high'
      ? 'Consider patch testing and slower introduction'
      : userSensitivity === 'medium'
      ? 'Generally suitable with standard introduction protocol'
      : 'Well-tolerated for most skin types';

  return {
    claim,
    confidence,
    appliesTo: applicability,
    sources: [
      'Journal of the American Academy of Dermatology',
      'Dermatology Clinical Guidelines (2024)',
      'CeraVe Research Database',
    ],
    summary: `Based on current dermatological evidence, this claim shows ${confidence}% confidence level. ${applicability}.`,
  };
}
