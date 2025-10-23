import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function PatchTestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps = [
    {
      title: 'Prepare Your Test Area',
      icon: <Clock className="w-12 h-12 text-cerave-blue mx-auto mb-4" />,
      content: (
        <>
          <p className="mb-3">Choose a small area of skin for testing:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-4">
            <li>Inner forearm (most common)</li>
            <li>Behind the ear (for facial products)</li>
            <li>Inner elbow</li>
          </ul>
          <p className="text-sm text-gray-600">
            Make sure the area is clean and dry before applying the product.
          </p>
        </>
      ),
    },
    {
      title: 'Apply & Wait',
      icon: <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />,
      content: (
        <>
          <p className="mb-3">Apply a small amount of the product:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 mb-4">
            <li>Use about a pea-sized amount</li>
            <li>Apply to your chosen test area</li>
            <li>Leave it on for 24-48 hours</li>
            <li>Avoid washing the area if possible</li>
          </ul>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Monitor for:</strong> Redness, itching, burning, swelling, or rash
            </p>
          </div>
        </>
      ),
    },
    {
      title: 'Evaluate Results',
      icon: <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />,
      content: (
        <>
          <p className="mb-3">After 24-48 hours, check the test area:</p>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm font-semibold text-green-800 mb-1">✓ No Reaction</p>
              <p className="text-sm text-green-700">
                Great! You can introduce this product into your routine following the ramp schedule.
              </p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-semibold text-red-800 mb-1">✗ Reaction Occurred</p>
              <p className="text-sm text-red-700">
                Stop use immediately. Consider consulting a dermatologist before trying alternatives.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
      console.log('patchtest_completed');
      setTimeout(() => {
        setIsOpen(false);
        setStep(0);
        setCompleted(false);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-cerave-blue mb-3">Safety First: Patch Testing</h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Before starting any new skincare product, especially actives like retinol, it's crucial to perform
        a patch test to minimize the risk of irritation.
      </p>
      <Button
        onClick={() => {
          setIsOpen(true);
          console.log('patchtest_started');
        }}
        className="bg-cerave-blue hover:bg-cerave-blue-dark"
        size="lg"
      >
        Start Patch Test Guide
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent onClose={() => setIsOpen(false)} className="max-w-md">
          {completed ? (
            <div className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Patch Test Guide Complete!</h3>
              <p className="text-sm text-gray-600">
                Remember to wait 24-48 hours before evaluating the results.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  Step {step + 1} of {steps.length}: {steps[step].title}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                {steps[step].icon}
                <div className="text-left">{steps[step].content}</div>
              </div>
              <div className="flex justify-between p-6 pt-0">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  disabled={step === 0}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-cerave-blue hover:bg-cerave-blue-dark"
                >
                  {step < steps.length - 1 ? 'Next' : 'Complete'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
