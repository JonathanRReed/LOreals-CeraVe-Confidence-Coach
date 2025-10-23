import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Bell, CheckCircle } from 'lucide-react';

export default function ReminderSetup() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSetReminder = () => {
    console.log('reminder_set', { time: 'AM/PM' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 bg-cerave-blue/10 rounded-full flex items-center justify-center mb-4">
        <Bell className="w-8 h-8 text-cerave-blue" />
      </div>
      <h2 className="text-2xl font-bold text-cerave-blue mb-3">Stay Consistent</h2>
      <p className="text-gray-600 mb-6">
        Set reminders to build a lasting skincare routine
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 border border-gray-200 rounded-lg hover:border-cerave-light-blue transition cursor-pointer text-left">
          <p className="font-semibold text-gray-900 mb-1 text-sm">Morning</p>
          <p className="text-xs text-gray-600">8:00 AM</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-lg hover:border-cerave-light-blue transition cursor-pointer text-left">
          <p className="font-semibold text-gray-900 mb-1 text-sm">Evening</p>
          <p className="text-xs text-gray-600">9:00 PM</p>
        </div>
      </div>

      <Button
        onClick={handleSetReminder}
        className="w-full bg-cerave-blue hover:bg-cerave-blue-dark hover:shadow-lg transition-all"
        size="lg"
      >
        {showSuccess ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Reminder Set!
          </>
        ) : (
          <>
            <Bell className="w-5 h-5 mr-2" />
            Enable Reminders
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Demo feature for prototype
      </p>
    </div>
  );
}
