
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AdMobAd from '@/components/AdMobAd';
import { toast } from '@/components/ui/sonner';
import { Video } from 'lucide-react';

// AdMob Ad Unit ID (from configuration)
const AD_UNIT_ID = 'ca-app-pub-9884257131349852/9475727853';

const WatchAds = () => {
  const { watchedAdsToday, incrementWatchedAds, canWatchMoreAds, coins } = useAppContext();
  const [showAd, setShowAd] = useState(false);
  
  const maxAdsPerDay = 5;
  const progressPercentage = (watchedAdsToday / maxAdsPerDay) * 100;
  
  const handleWatchAd = () => {
    if (!canWatchMoreAds) {
      toast("You've reached your daily limit. Come back tomorrow!");
      return;
    }
    
    console.log(`Loading AdMob ad unit: ${AD_UNIT_ID}`);
    setShowAd(true);
  };
  
  const handleAdComplete = () => {
    incrementWatchedAds();
    setShowAd(false);
    toast.success("You earned 2 coins from watching an ad!");
  };
  
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Watch Ads</h1>
        
        <Card className="p-4">
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">Watch ads to earn coins</p>
            <p className="text-sm text-gray-500">Earn 2 coins per ad watched</p>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-app-purple bg-opacity-10 flex items-center justify-center mb-4">
              <Video className="w-10 h-10 text-app-purple" />
            </div>
            
            <p className="font-medium">
              {watchedAdsToday} / {maxAdsPerDay} ads watched today
            </p>
            <div className="w-full mt-2">
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
          
          <Button
            className="w-full"
            onClick={handleWatchAd}
            disabled={!canWatchMoreAds}
          >
            {canWatchMoreAds
              ? "Watch Ad Now"
              : "Daily Limit Reached"}
          </Button>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <h3 className="font-semibold mb-1">Current Balance</h3>
            <p className="text-2xl font-bold text-app-purple">{coins} coins</p>
            <p className="text-sm text-gray-500 mt-2">
              You can earn up to 10 coins daily from ads!
            </p>
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

export default WatchAds;
