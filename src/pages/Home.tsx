
import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdMobAd from '@/components/AdMobAd';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const spinOptions = [0, 5, 15, 25, 24, 30, 45, 50, 47, 49];

const Home = () => {
  const { 
    coins, 
    addCoins, 
    spinsUsedToday,
    remainingSpins,
    maxDailySpins,
    incrementSpinsUsed 
  } = useAppContext();
  
  const [showAd, setShowAd] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const handleSpin = () => {
    if (remainingSpins <= 0) {
      toast("You've used all your spins for today! Come back tomorrow.");
      return;
    }
    
    setShowAd(true);
  };
  
  const handleAdComplete = () => {
    setShowAd(false);
    startSpin();
  };
  
  const startSpin = () => {
    setIsSpinning(true);
    
    // Random number of rotations (3-5 full rotations)
    const rotations = 3 + Math.random() * 2;
    
    // Random result from options
    const resultIndex = Math.floor(Math.random() * spinOptions.length);
    const result = spinOptions[resultIndex];
    
    // Calculate rotation angle
    const segmentAngle = 360 / spinOptions.length;
    const resultAngle = resultIndex * segmentAngle;
    const finalRotation = rotations * 360 + resultAngle;
    
    // Apply animation
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }
    
    // After animation completes
    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(result);
      
      // Add coins to balance
      addCoins(result);
      incrementSpinsUsed();
      
      toast.success(`Congratulations! You won ${result} coins!`);
    }, 3000);
  };
  
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Spin & Win</h1>
        
        <Card className="p-4 flex flex-col items-center">
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">Spin the wheel to win coins!</p>
            <p className="text-sm text-gray-500">
              Remaining spins today: <span className="font-medium">{remainingSpins}</span> of {maxDailySpins}
            </p>
          </div>
          
          {/* Wheel */}
          <div className="relative w-52 h-52 mb-8 mt-4">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-3 h-6 bg-red-500"></div>
            </div>
            
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full bg-app-purple border-4 border-app-purple-dark relative transition-transform duration-3000 ease-out"
              style={{ transformOrigin: 'center center' }}
            >
              {spinOptions.map((value, index) => {
                const rotate = (index * (360 / spinOptions.length)).toFixed(1);
                const color = index % 2 === 0 ? 'bg-app-purple' : 'bg-app-purple-light';
                
                return (
                  <div
                    key={index}
                    className={`absolute w-full h-full ${color} flex justify-center items-start`}
                    style={{
                      clipPath: 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)',
                      transform: `rotate(${rotate}deg)`,
                    }}
                  >
                    <div className="absolute top-4 transform -translate-x-1/2 left-1/2">
                      <span className="text-white font-bold text-base bg-black bg-opacity-70 px-2 py-1 rounded-full">
                        {value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Button
            className="w-full max-w-xs"
            onClick={handleSpin}
            disabled={remainingSpins <= 0 || isSpinning}
          >
            {isSpinning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Spinning...
              </>
            ) : remainingSpins <= 0 ? (
              "Come Back Tomorrow"
            ) : (
              "Spin & Win"
            )}
          </Button>
          
          {spinResult !== null && (
            <div className="mt-4 text-center">
              <p className="text-lg font-medium">
                You won <span className="text-app-purple font-bold">{spinResult}</span> coins!
              </p>
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <h3 className="font-semibold mb-1">Current Balance</h3>
            <p className="text-2xl font-bold text-app-purple">{coins} coins</p>
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

export default Home;
