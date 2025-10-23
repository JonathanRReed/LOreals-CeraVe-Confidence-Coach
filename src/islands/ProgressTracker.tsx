import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Camera, CheckCircle } from 'lucide-react';

interface CheckIn {
  day: number;
  date: string;
  notes: string;
  symptoms: string[];
}

export default function ProgressTracker() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [currentNotes, setCurrentNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const symptoms = ['Redness', 'Dryness', 'Oiliness', 'Breakouts', 'Irritation', 'Improvement'];

  const addCheckIn = () => {
    const newCheckIn: CheckIn = {
      day: checkIns.length + 1,
      date: new Date().toLocaleDateString(),
      notes: currentNotes,
      symptoms: [...selectedSymptoms],
    };

    setCheckIns([...checkIns, newCheckIn]);
    setCurrentNotes('');
    setSelectedSymptoms([]);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  return (
    <>
        <Card className="border-cerave-blue/20 mb-6 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl text-cerave-blue">Progress Tracker</CardTitle>
            <CardDescription className="text-sm">
              Log daily check-ins to see patterns and improvements over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How's your skin today?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-2 text-sm rounded-md border transition ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-cerave-blue text-white border-cerave-blue'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-cerave-light-blue'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Any observations or changes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cerave-blue focus:border-cerave-blue resize-none transition-all hover:border-cerave-light-blue"
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={addCheckIn}
                disabled={selectedSymptoms.length === 0}
                className="flex-1 bg-cerave-blue hover:bg-cerave-blue-dark hover:shadow-lg transition-all disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Check-In
              </Button>
              <Button variant="outline" className="flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {checkIns.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900">Your Check-Ins</h3>
            {checkIns
              .slice()
              .reverse()
              .map((checkIn, idx) => (
                <Card key={idx} className="border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">Day {checkIn.day}</p>
                        <p className="text-sm text-gray-500">{checkIn.date}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {checkIn.symptoms.map((symptom, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-cerave-blue/10 text-cerave-blue rounded-full"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                    {checkIn.notes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{checkIn.notes}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {checkIns.length === 0 && (
          <Card className="border-cerave-blue/20 shadow-sm">
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No check-ins yet. Start tracking your progress today!</p>
            </CardContent>
          </Card>
        )}
    </>
  );
}
