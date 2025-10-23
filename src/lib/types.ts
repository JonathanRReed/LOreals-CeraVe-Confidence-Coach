export type SkinType = 'dry' | 'oily' | 'combo' | 'normal';
export type Sensitivity = 'low' | 'medium' | 'high';
export type Concern = 'acne' | 'texture' | 'redness' | 'darkspots';

export interface UserProfile {
  skinType: SkinType;
  concerns: Concern[];
  sensitivity: Sensitivity;
  budget: 'low' | 'mid' | 'high';
  preferences: {
    spfOk: boolean;
    fragranceFree: boolean;
    quickAM: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  step: 'cleanse' | 'treat' | 'moisturize' | 'spf';
  notes: string;
}

export interface RoutinePlan {
  am: Product[];
  pm: Product[];
  rampNotes: string[];
}

export interface Milestone {
  day: number;
  title: string;
  note: string;
}

export interface EvidenceCard {
  claim: string;
  confidence: number;
  appliesTo: string;
  sources: string[];
  summary: string;
}
