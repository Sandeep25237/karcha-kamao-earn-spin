
import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

// AdMob Configuration
const ADMOB_APP_ID = 'ca-app-pub-9884257131349852~8583116889';
const ADMOB_UNIT_ID = 'ca-app-pub-9884257131349852/9475727853';

interface AdMobAdProps {
  onComplete: () => void;
  onDismiss?: () => void;
}

const AdMobAd = ({ onComplete, onDismiss }: AdMobAdProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [adError, setAdError] = useState<string | null>(null);
  
  // Initialize AdMob
  useEffect(() => {
    console.log(`Initializing AdMob with App ID: ${ADMOB_APP_ID}`);
    console.log(`Loading ad unit: ${ADMOB_UNIT_ID}`);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      // In a real implementation, we would initialize the AdMob SDK here
      
      // For now, we'll simulate successful ad display
      const simulateAdDisplay = setTimeout(() => {
        console.log("Ad display completed");
        onComplete();
      }, 2000);
      
      return () => clearTimeout(simulateAdDisplay);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  const handleDismiss = () => {
    console.log("Ad dismissed by user");
    if (onDismiss) onDismiss();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Advertisement</h3>
          {onDismiss && (
            <button 
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-purple"></div>
              </div>
              <p className="text-center text-gray-600">
                Loading advertisement...
              </p>
            </div>
          ) : adError ? (
            <div className="flex flex-col items-center">
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <p className="text-red-500">Ad failed to load</p>
              </div>
              <Button onClick={handleDismiss} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full h-40 bg-gray-800 rounded-lg mb-4 flex flex-col items-center justify-center text-white p-4">
                <p className="text-sm mb-2">AdMob Advertisement</p>
                <p className="text-xs text-center opacity-75">ID: {ADMOB_UNIT_ID}</p>
                <p className="mt-4 text-xs text-center">(Simulated for development)</p>
              </div>
              <p className="text-center mb-4 text-sm text-gray-500">
                In production, your real AdMob ad would appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdMobAd;
