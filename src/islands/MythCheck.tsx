import { useState } from 'react';
import { generateMockEvidence } from '../lib/mock';
import type { EvidenceCard } from '../lib/types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Search } from 'lucide-react';

export default function MythCheck() {
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState<EvidenceCard | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    setLoading(true);
    console.log('mythcheck_submitted', { claim });

    setTimeout(() => {
      const mockEvidence = generateMockEvidence(claim, 'medium');
      setEvidence(mockEvidence);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cerave-blue mb-3">Myth Check Tool</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Confused by a skincare claim? Paste it here to see how it relates to evidence-based dermatology.
        </p>
      </div>

        <Card className="border-cerave-blue/20">
          <CardHeader>
            <CardTitle className="text-lg">Enter a Skincare Claim</CardTitle>
            <CardDescription>
              Example: "Retinol helps with acne" or "Vitamin C brightens skin"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="Paste a claim or statement about skincare ingredients..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cerave-blue focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !claim.trim()}
                className="w-full bg-cerave-blue hover:bg-cerave-blue-dark"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Analyzing...' : 'Check This Claim'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {evidence && (
          <Card className="mt-6 border-cerave-blue/30">
            <CardHeader className="bg-gradient-to-r from-cerave-blue/5 to-cerave-light-blue/5">
              <CardTitle className="text-cerave-blue">Evidence Assessment</CardTitle>
              <CardDescription className="text-gray-700 italic">"{evidence.claim}"</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                  <span className="text-lg font-bold text-cerave-blue">{evidence.confidence}%</span>
                </div>
                <Progress value={evidence.confidence} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  {evidence.confidence >= 80
                    ? 'Strong evidence support'
                    : evidence.confidence >= 60
                    ? 'Moderate evidence support'
                    : 'Limited evidence support'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{evidence.summary}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Applicability to You</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md border border-cerave-light-blue">
                  {evidence.appliesTo}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Sources</h4>
                <ul className="space-y-1">
                  {evidence.sources.map((source, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-cerave-blue mr-2">•</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  Note: This is a prototype tool for educational purposes. Always consult with a
                  dermatologist for personalized advice.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
