import { useState, useEffect } from 'react';
import type { RoutinePlan, UserProfile } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Sun, Moon, Droplets, Shield, Sparkles, Info } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handlePlanReady = (event: Event) => {
      setIsLoading(true);
      setTimeout(() => {
        const customEvent = event as CustomEvent;
        setPlanData(customEvent.detail);
        setIsLoading(false);
      }, 300);
    };

    window.addEventListener('plan-ready', handlePlanReady);
    return () => window.removeEventListener('plan-ready', handlePlanReady);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-cerave-blue/20 h-full min-h-[500px]">
        <CardHeader className="bg-gradient-to-r from-cerave-blue/20 to-cerave-light-blue/20">
          <div className="h-6 bg-cerave-blue/20 rounded w-3/4 mx-auto animate-pulse"></div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-4 bg-gray-100 rounded-xl animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!planData) {
    return (
      <Card className="border-cerave-blue/20 h-full flex items-center justify-center min-h-[500px]">
        <CardContent className="text-center p-12">
          <div className="w-20 h-20 bg-cerave-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
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
    <div className="space-y-6 animate-fadeIn">
      <Card className="border-cerave-blue/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cerave-blue to-cerave-light-blue text-white">
          <CardTitle className="text-xl text-center">Your Personalized Routine</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    <p className="font-semibold mb-1">How is this calculated?</p>
                    <p>• Product-skin type match (+10)</p>
                    <p>• Complete AM/PM routines (+20)</p>
                    <p>• Sensitivity adjustments (-10 if high)</p>
                    <p>• Safety education (+10)</p>
                    <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold text-cerave-blue">
                {confidence.score}% <span className="text-sm font-normal text-gray-600">({confidence.label})</span>
              </span>
            </div>
            <Progress value={confidence.score} className="h-3 transition-all duration-700" />
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
                  className="flex gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:shadow-md transition-shadow"
                >
                  {product.imageUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 bg-cerave-blue text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      {stepIcons[product.step]}
                      <h4 className="font-semibold text-gray-900 capitalize text-sm">{product.step}</h4>
                    </div>
                    <p className="font-bold text-cerave-blue mb-1 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.notes}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="pm" className="space-y-3">
              {plan.pm.map((product, idx) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow"
                >
                  {product.imageUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 bg-cerave-blue text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      {stepIcons[product.step]}
                      <h4 className="font-semibold text-gray-900 capitalize text-sm">{product.step}</h4>
                    </div>
                    <p className="font-bold text-cerave-blue mb-1 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.notes}</p>
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
