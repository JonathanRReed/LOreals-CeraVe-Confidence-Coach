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
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-cerave-blue/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-cerave-blue/10 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-cerave-blue" />
            </div>
            <CardTitle className="text-2xl text-cerave-blue">Stay Consistent</CardTitle>
            <CardDescription className="text-base">
              Set reminders to build a lasting skincare routine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-cerave-light-blue transition cursor-pointer">
                <p className="font-semibold text-gray-900 mb-1">Morning Routine</p>
                <p className="text-sm text-gray-600">Remind me at 8:00 AM</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-cerave-light-blue transition cursor-pointer">
                <p className="font-semibold text-gray-900 mb-1">Evening Routine</p>
                <p className="text-sm text-gray-600">Remind me at 9:00 PM</p>
              </div>
            </div>

            <Button
              onClick={handleSetReminder}
              className="w-full bg-cerave-blue hover:bg-cerave-blue-dark"
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

            <p className="text-xs text-center text-gray-500">
              This is a demo feature. In a production app, this would integrate with your device notifications.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
