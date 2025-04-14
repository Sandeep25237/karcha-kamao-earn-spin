import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { ADMOB_CONFIG, getAdUnitId, shouldUseTestAds } from '@/utils/admobConfig';
import AdMob from '@/plugins/admob';

interface AdMobAdProps {
  onComplete: () => void;
  onDismiss?: () => void;
}

// Type definition for window with cordova
declare global {
  interface Window {
    cordova?: {
      plugins?: {
        admob?: any;
      };
    };
  }
}

const AdMobAd = ({ onComplete, onDismiss }: AdMobAdProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [adError, setAdError] = useState<string | null>(null);
  
  // Get the appropriate ad unit ID based on environment
  const adUnitId = getAdUnitId();
  
  // Initialize AdMob
  useEffect(() => {
    console.log(`Initializing AdMob with App ID: ${ADMOB_CONFIG.APP_ID}`);
    console.log(`Loading ad unit: ${adUnitId}`);
    
    const initializeAdMob = async () => {
      try {
        // Check if this is running on a mobile device with Capacitor
        if ('Capacitor' in window) {
          console.log("Running in Capacitor environment");
          try {
            await AdMob.initialize({ appId: ADMOB_CONFIG.APP_ID });
            console.log("AdMob initialized successfully in Capacitor");
            
            setIsLoading(false);
            
            try {
              const result = await AdMob.showRewardedAd({
                adUnitId: adUnitId
              });
              
              console.log("Ad result:", result);
              
              if (result.rewarded) {
                onComplete();
              }
            } catch (adError) {
              console.error("Error showing ad:", adError);
              setAdError("Failed to show ad. Please try again later.");
            }
          } catch (initError) {
            console.error("Error initializing AdMob:", initError);
            setAdError("Failed to initialize ads. Please check your connection.");
          }
        } else if (window.cordova?.plugins?.admob) {
          console.log("Cordova AdMob plugin is available");
          // Legacy Cordova implementation
          try {
            window.cordova.plugins.admob.initialize(ADMOB_CONFIG.APP_ID);
            console.log("AdMob initialized successfully in Cordova");
            
            // Implement Cordova specific ad display logic
          } catch (error) {
            console.error("Error initializing Cordova AdMob:", error);
            setAdError("Failed to initialize AdMob plugin");
          }
        } else {
          console.log("Native AdMob environment not detected");
          console.log("Simulating ad display for development");
          
          // For non-native environment, simulate ad display
          const timer = setTimeout(() => {
            setIsLoading(false);
            
            // Simulate successful ad display after delay
            const simulateAdDisplay = setTimeout(() => {
              console.log("Simulated ad display completed");
              onComplete();
            }, 2000);
            
            return () => clearTimeout(simulateAdDisplay);
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error("General error in AdMob initialization:", err);
        setAdError("Unexpected error in ad system");
        setIsLoading(false);
      }
    };
    
    initializeAdMob();
  }, [onComplete, adUnitId]);
  
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
                <p className="text-red-500">{adError}</p>
              </div>
              <Button onClick={handleDismiss} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full h-40 bg-gray-800 rounded-lg mb-4 flex flex-col items-center justify-center text-white p-4">
                <p className="text-sm mb-2">AdMob Advertisement</p>
                <p className="text-xs text-center opacity-75">ID: {adUnitId}</p>
                <p className="mt-4 text-xs text-center">
                  {shouldUseTestAds() ? "(Test Ad)" : "(Production Ad)"}
                </p>
              </div>
              <p className="text-center mb-4 text-sm text-gray-500">
                {window.hasOwnProperty('Capacitor') || window.cordova ? "Loading real AdMob ad..." : "Real AdMob ad would appear here on device"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdMobAd;
