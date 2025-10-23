import { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile.concerns.length === 0) {
      alert('Please select at least one skin concern');
      return;
    }

    const plan = buildPlan(profile);
    const confidence = scoreConfidence(profile, plan);

    const event = new CustomEvent('plan-ready', {
      detail: { profile, plan, confidence },
    });
    window.dispatchEvent(event);

    console.log('plan_generated', { confidence, profile });
    setSubmitted(true);
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

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto border-cerave-blue/20">
        <CardHeader className="bg-gradient-to-r from-cerave-blue/10 to-cerave-light-blue/10">
          <CardTitle className="text-cerave-blue">Your Routine is Ready!</CardTitle>
          <CardDescription>Scroll down to view your personalized plan</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="w-full"
          >
            Edit My Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto border-cerave-blue/20">
      <CardHeader className="bg-gradient-to-r from-cerave-blue/10 to-cerave-light-blue/10">
        <CardTitle className="text-cerave-blue">Build Your Personalized Routine</CardTitle>
        <CardDescription>
          Answer a few questions to get a skincare routine designed for your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 mb-2">
              What's your skin type?
            </label>
            <select
              id="skinType"
              value={profile.skinType}
              onChange={(e) => setProfile({ ...profile, skinType: e.target.value as SkinType })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cerave-blue focus:border-transparent"
            >
              <option value="dry">Dry - Feels tight, may flake</option>
              <option value="oily">Oily - Shiny, enlarged pores</option>
              <option value="combo">Combination - Oily T-zone, dry cheeks</option>
              <option value="normal">Normal - Balanced, few concerns</option>
            </select>
          </div>

          <div>
            <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-700 mb-2">
              How sensitive is your skin?
            </label>
            <select
              id="sensitivity"
              value={profile.sensitivity}
              onChange={(e) => setProfile({ ...profile, sensitivity: e.target.value as Sensitivity })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cerave-blue focus:border-transparent"
            >
              <option value="low">Low - Rarely reacts to products</option>
              <option value="medium">Medium - Occasional sensitivity</option>
              <option value="high">High - Reacts easily to new products</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are your main skin concerns? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['acne', 'texture', 'redness', 'darkspots'] as Concern[]).map((concern) => (
                <label
                  key={concern}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition ${
                    profile.concerns.includes(concern)
                      ? 'border-cerave-blue bg-cerave-blue/5'
                      : 'border-gray-300 hover:border-cerave-light-blue'
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
            className="w-full bg-cerave-blue hover:bg-cerave-blue-dark text-white"
            size="lg"
          >
            Build My Routine
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
