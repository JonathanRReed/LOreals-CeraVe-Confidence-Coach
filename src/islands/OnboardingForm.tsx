import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Info } from 'lucide-react';
import type { UserProfile, Concern, SkinType, Sensitivity } from '../lib/types';
import { buildPlan } from '../lib/mapping';
import { scoreConfidence } from '../lib/confidence';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function OnboardingForm() {
  const [profile, setProfile] = useState<UserProfile>({
    skinType: 'combo',
    concerns: [],
    sensitivity: 'medium',
    budget: 'mid',
    preferences: {
      spfOk: true,
      fragranceFree: true,
      quickAM: true,
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsGenerating(true);

    // Simulate generation with delay for demo effect
    setTimeout(() => {
      const plan = buildPlan(profile);
      const confidence = scoreConfidence(profile, plan);

      const event = new CustomEvent('plan-ready', {
        detail: { profile, plan, confidence },
      });
      window.dispatchEvent(event);

      console.log('plan_generated', { confidence, profile });
      setSubmitted(true);
      setIsGenerating(false);

      // Confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2A5CAA', '#7BA5D6', '#FFFFFF']
      });

      // Smooth scroll to plan (slight delay for effect)
      setTimeout(() => {
        const planElement = document.querySelector('#plan');
        if (planElement) {
          planElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    }, 800); // Simulated loading time
  };

  const toggleConcern = (concern: Concern) => {
    const set = new Set(profile.concerns);
    if (set.has(concern)) {
      set.delete(concern);
    } else {
      set.add(concern);
    }
    setProfile({ ...profile, concerns: Array.from(set) });
  };

  const loadPreset = (preset: 'acne' | 'antiaging' | 'sensitive') => {
    const presets = {
      acne: {
        skinType: 'oily' as SkinType,
        concerns: ['acne', 'texture'] as Concern[],
        sensitivity: 'low' as Sensitivity,
      },
      antiaging: {
        skinType: 'dry' as SkinType,
        concerns: ['texture', 'darkspots'] as Concern[],
        sensitivity: 'medium' as Sensitivity,
      },
      sensitive: {
        skinType: 'combo' as SkinType,
        concerns: ['redness'] as Concern[],
        sensitivity: 'high' as Sensitivity,
      },
    };
    
    setProfile({ ...profile, ...presets[preset] });
  };

  return (
    <Card className="border-cerave-blue/20 lg:sticky lg:top-24">
      <CardHeader className="bg-gradient-to-r from-cerave-blue/10 to-cerave-light-blue/10">
        <CardTitle className="text-cerave-blue text-xl">
          {submitted ? 'Your Profile' : 'Build Your Routine'}
        </CardTitle>
        <CardDescription>
          {submitted ? 'Your personalized plan is ready →' : 'Answer a few questions to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!submitted && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-cerave-blue/20">
            <p className="text-xs font-semibold text-cerave-blue mb-2">Try an Example:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => loadPreset('acne')}
                className="flex-1 px-3 py-2 bg-white text-xs font-medium text-cerave-blue border border-cerave-blue/30 rounded hover:bg-cerave-blue hover:text-white transition-all"
              >
                Acne-Prone
              </button>
              <button
                type="button"
                onClick={() => loadPreset('antiaging')}
                className="flex-1 px-3 py-2 bg-white text-xs font-medium text-cerave-blue border border-cerave-blue/30 rounded hover:bg-cerave-blue hover:text-white transition-all"
              >
                Anti-Aging
              </button>
              <button
                type="button"
                onClick={() => loadPreset('sensitive')}
                className="flex-1 px-3 py-2 bg-white text-xs font-medium text-cerave-blue border border-cerave-blue/30 rounded hover:bg-cerave-blue hover:text-white transition-all"
              >
                Sensitive
              </button>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="skinType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              What's your skin type?
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                  Not sure? Look at your T-zone (forehead, nose, chin) a few hours after cleansing.
                </div>
              </div>
            </label>
            <select
              id="skinType"
              value={profile.skinType}
              onChange={(e) => setProfile({ ...profile, skinType: e.target.value as SkinType })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerave-blue focus:border-cerave-blue transition-all bg-white hover:border-cerave-light-blue"
            >
              <option value="dry">Dry - Feels tight, may flake</option>
              <option value="oily">Oily - Shiny, enlarged pores</option>
              <option value="combo">Combination - Oily T-zone, dry cheeks</option>
              <option value="normal">Normal - Balanced, few concerns</option>
            </select>
          </div>

          <div>
            <label htmlFor="sensitivity" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              How sensitive is your skin?
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                  High sensitivity means your skin often reacts with redness, itching, or burning to new products.
                </div>
              </div>
            </label>
            <select
              id="sensitivity"
              value={profile.sensitivity}
              onChange={(e) => setProfile({ ...profile, sensitivity: e.target.value as Sensitivity })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerave-blue focus:border-cerave-blue transition-all bg-white hover:border-cerave-light-blue"
            >
              <option value="low">Low - Rarely reacts to products</option>
              <option value="medium">Medium - Occasional sensitivity</option>
              <option value="high">High - Reacts easily to new products</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are your main skin concerns? <span className="text-gray-500 font-normal text-xs">(Optional - select all that apply)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['acne', 'texture', 'redness', 'darkspots'] as Concern[]).map((concern) => (
                <label
                  key={concern}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-200 ${
                    profile.concerns.includes(concern)
                      ? 'border-cerave-blue bg-cerave-blue/5 shadow-sm scale-[1.02]'
                      : 'border-gray-300 hover:border-cerave-light-blue hover:shadow-sm'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={profile.concerns.includes(concern)}
                    onChange={() => toggleConcern(concern)}
                    className="mr-2 h-4 w-4 text-cerave-blue focus:ring-cerave-blue border-gray-300 rounded"
                  />
                  <span className="text-sm capitalize">{concern === 'darkspots' ? 'Dark Spots' : concern}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences.spfOk}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, spfOk: e.target.checked },
                  })
                }
                className="h-4 w-4 text-cerave-blue focus:ring-cerave-blue border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">I'm willing to use SPF daily</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-cerave-blue hover:bg-cerave-blue-dark text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : submitted ? 'Update My Routine' : 'Build My Routine'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
