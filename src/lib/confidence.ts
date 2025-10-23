import type { UserProfile, RoutinePlan } from './types';

export function scoreConfidence(
  p: UserProfile,
  r: RoutinePlan,
  patchTestCompleted: boolean = false
): { score: number; label: string } {
  let base = 60;
  let profileMatch = 0;
  let completeness = 0;
  let penalty = 0;
  let edu = 0;

  const cleanserOk =
    (p.skinType === 'oily' && r.am[0].name.includes('Foaming')) ||
    (p.skinType !== 'oily' && r.am[0].name.includes('Hydrating'));

  if (cleanserOk) profileMatch += 10;

  const amSteps = new Set(r.am.map((s) => s.step));
  const pmSteps = new Set(r.pm.map((s) => s.step));

  if (amSteps.has('cleanse') && (amSteps.has('spf') || amSteps.has('moisturize'))) {
    completeness += 10;
  }

  if (pmSteps.has('cleanse') && pmSteps.has('moisturize')) {
    completeness += 10;
  }

  if (p.sensitivity === 'high' && pmSteps.has('treat')) {
    penalty -= 10;
  }

  if (patchTestCompleted) {
    edu += 10;
  }

  const score = Math.max(0, Math.min(100, base + profileMatch + completeness + penalty + edu));
  const label = score >= 75 ? 'High' : score >= 50 ? 'Moderate' : 'Low';

  return { score, label };
}
