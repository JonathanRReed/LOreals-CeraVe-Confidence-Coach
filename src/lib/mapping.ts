import type { UserProfile, RoutinePlan, Product } from './types';

export function buildPlan(p: UserProfile): RoutinePlan {
  const am: Product[] = [];
  const pm: Product[] = [];

  const cleanser =
    p.skinType === 'oily'
      ? {
          id: 'cleanser2',
          name: 'CeraVe Foaming Facial Cleanser',
          step: 'cleanse' as const,
          notes: 'Use morning and night',
          imageUrl: 'https://images.unsplash.com/photo-1556228852-80a3c87e9d82?w=200&h=200&fit=crop',
        }
      : {
          id: 'cleanser1',
          name: 'CeraVe Hydrating Facial Cleanser',
          step: 'cleanse' as const,
          notes: 'Use morning and night',
          imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop',
        };

  am.push(cleanser);
  pm.push(cleanser);

  if (p.preferences.spfOk) {
    am.push({
      id: 'spf1',
      name: 'CeraVe AM Facial Moisturizing Lotion SPF 30',
      step: 'spf',
      notes: 'Apply generously every morning',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
    });
  } else {
    am.push({
      id: 'moistam',
      name: 'CeraVe Moisturizing Lotion',
      step: 'moisturize',
      notes: 'Follow with separate SPF',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop',
    });
  }

  const needsRetinol =
    p.concerns.includes('acne') || p.concerns.includes('darkspots');

  if (needsRetinol) {
    pm.splice(1, 0, {
      id: 'retinol',
      name: 'CeraVe Resurfacing Retinol Serum',
      step: 'treat',
      notes:
        p.sensitivity === 'high'
          ? 'Start with 2x per week'
          : 'Start with 3x per week',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop&sat=-100',
    });
  }

  pm.push({
    id: 'moistpm',
    name: 'CeraVe PM Facial Moisturizing Lotion',
    step: 'moisturize',
    notes: 'Apply nightly',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop',
  });

  const rampNotes = needsRetinol
    ? p.sensitivity === 'high'
      ? [
          'Week 1: Use retinol 2x/week (Mon, Thu)',
          'Week 2-3: Increase to 3x/week if no irritation',
          'Week 4+: Adjust based on skin tolerance',
        ]
      : [
          'Week 1: Use retinol 3x/week (Mon, Wed, Fri)',
          'Week 2-3: Increase to every other night if tolerated',
          'Week 4+: Progress to nightly if skin adapts well',
        ]
    : [
          'Maintain consistency with your routine',
          'Focus on hydration and sun protection',
          'Reassess your needs every 30 days',
        ];

  return { am, pm, rampNotes };
}
