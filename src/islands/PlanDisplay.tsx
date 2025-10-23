import { useState, useEffect } from 'react';
import type { RoutinePlan, UserProfile } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Sun, Moon, Droplets, Shield, Sparkles } from 'lucide-react';

interface PlanData {
  profile: UserProfile;
  plan: RoutinePlan;
  confidence: { score: number; label: string };
}

const stepIcons = {
  cleanse: <Droplets className="w-5 h-5" />,
  treat: <Sparkles className="w-5 h-5" />,
  moisturize: <Droplets className="w-5 h-5" />,
  spf: <Shield className="w-5 h-5" />,
};

export default function PlanDisplay() {
  const [planData, setPlanData] = useState<PlanData | null>(null);

  useEffect(() => {
    const handlePlanReady = (event: Event) => {
      const customEvent = event as CustomEvent;
      setPlanData(customEvent.detail);
    };

    window.addEventListener('plan-ready', handlePlanReady);
    return () => window.removeEventListener('plan-ready', handlePlanReady);
  }, []);

  if (!planData) {
    return (
      <Card className="border-cerave-blue/20 h-full flex items-center justify-center min-h-[500px]">
        <CardContent className="text-center p-12">
          <div className="w-20 h-20 bg-cerave-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-cerave-blue" />
          </div>
          <h3 className="text-2xl font-bold text-cerave-blue mb-3">Your Routine Awaits</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Complete the form on the left to generate your personalized 90-day skincare plan with CeraVe products.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { plan, confidence } = planData;

  return (
    <div className="space-y-6">
      <Card className="border-cerave-blue/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cerave-blue to-cerave-light-blue text-white">
          <CardTitle className="text-xl text-center">Your Personalized Routine</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Confidence Score</span>
              <span className="text-2xl font-bold text-cerave-blue">
                {confidence.score}% <span className="text-sm font-normal text-gray-600">({confidence.label})</span>
              </span>
            </div>
            <Progress value={confidence.score} className="h-3" />
            <p className="text-xs text-gray-600 mt-2">
              This score reflects how well your routine matches your profile and includes safety considerations.
            </p>
          </div>

          <Tabs defaultValue="am" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="am" className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Morning Routine
              </TabsTrigger>
              <TabsTrigger value="pm" className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Evening Routine
              </TabsTrigger>
            </TabsList>

            <TabsContent value="am" className="space-y-3">
              {plan.am.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-cerave-blue text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {stepIcons[product.step]}
                      <h4 className="font-semibold text-gray-900 capitalize">{product.step}</h4>
                    </div>
                    <p className="font-medium text-cerave-blue mb-1">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.notes}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pm" className="space-y-3">
              {plan.pm.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-cerave-blue text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {stepIcons[product.step]}
                      <h4 className="font-semibold text-gray-900 capitalize">{product.step}</h4>
                    </div>
                    <p className="font-medium text-cerave-blue mb-1">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.notes}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {plan.rampNotes && plan.rampNotes.length > 0 && (
            <div className="mt-5 p-3 bg-blue-50 border border-cerave-light-blue rounded-lg">
              <h4 className="font-semibold text-cerave-blue mb-2 text-sm">Gradual Introduction Schedule</h4>
              <ul className="space-y-1">
                {plan.rampNotes.map((note, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-cerave-blue mr-2">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
