
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';
import AdMobAd from '@/components/AdMobAd';
import { CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const DailyLogin = () => {
  const { currentDay, checkedInDays, checkInToday } = useAppContext();
  const [showAd, setShowAd] = useState(false);
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
  
  const handleCheckIn = () => {
    if (checkedInDays.includes(currentDay)) {
      toast("You've already checked in today!");
      return;
    }
    
    setShowAd(true);
  };
  
  const handleAdComplete = () => {
    checkInToday();
    setShowAd(false);
    toast.success("Check-in successful! +10 coins added.");
  };
  
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Daily Check-In</h1>
        
        <Card className="p-4">
          <div className="mb-4">
            <p className="text-lg font-semibold text-center mb-1">
              Check in every day to earn coins!
            </p>
            <p className="text-gray-500 text-center text-sm">
              Today is {currentDay}
            </p>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day) => {
              const isCheckedIn = checkedInDays.includes(day);
              const isToday = day === currentDay;
              
              return (
                <div
                  key={day}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-md border ${
                    isToday ? 'border-app-purple bg-app-purple bg-opacity-10' : 'border-gray-200'
                  }`}
                >
                  <div className="text-xs mb-1">{day.substring(0, 3)}</div>
                  {isCheckedIn ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
          
          <Button
            className="w-full"
            onClick={handleCheckIn}
            disabled={checkedInDays.includes(currentDay)}
          >
            {checkedInDays.includes(currentDay)
              ? "Already Checked In"
              : "Check In Today"}
          </Button>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Check-In Benefits</h3>
            <p className="text-gray-600 text-sm">Earn 10 coins every day you check in!</p>
          </div>
        </Card>
      </div>
      
      {showAd && (
        <AdMobAd 
          onComplete={handleAdComplete} 
          onDismiss={() => setShowAd(false)}
        />
      )}
    </Layout>
  );
};

export default DailyLogin;
