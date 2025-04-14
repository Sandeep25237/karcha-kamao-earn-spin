
import { Coins } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const CoinBalance = () => {
  const { coins } = useAppContext();
  
  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-app-purple rounded-full text-white">
      <Coins className="w-4 h-4" />
      <span className="font-medium">{coins}</span>
    </div>
  );
};

export default CoinBalance;
