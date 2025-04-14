
import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface VideoAdProps {
  onComplete: () => void;
  onDismiss?: () => void;
}

const VideoAd = ({ onComplete, onDismiss }: VideoAdProps) => {
  const [progress, setProgress] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isWatching) {
      intervalId = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalId as number);
            setIsWatching(false);
            onComplete();
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isWatching, onComplete]);
  
  const handleStartAd = () => {
    setIsWatching(true);
    toast("Ad started. Please wait...");
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Watch Ad</h3>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="p-6">
          {!isWatching ? (
            <div className="flex flex-col items-center">
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-center mb-4 text-gray-600">
                Watch a short video to earn coins!
              </p>
              <Button onClick={handleStartAd} className="w-full">
                Start Ad
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full h-40 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <div className="animate-pulse text-white">
                  Ad playing...
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-app-purple h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm">
                Please wait... {Math.floor(progress/10)}/10 seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoAd;
