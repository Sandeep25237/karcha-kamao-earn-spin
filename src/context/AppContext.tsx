
import React, { createContext, useContext, useState, useEffect } from 'react';

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface WithdrawalRecord {
  id: string;
  amount: number;
  upiId: string;
  date: string;
  status: 'pending' | 'completed';
}

interface AppContextType {
  coins: number;
  addCoins: (amount: number) => void;
  currentDay: DayOfWeek;
  checkedInDays: DayOfWeek[];
  checkInToday: () => void;
  watchedAdsToday: number;
  incrementWatchedAds: () => void;
  canWatchMoreAds: boolean;
  withdrawalHistory: WithdrawalRecord[];
  addWithdrawalRecord: (record: Omit<WithdrawalRecord, 'id' | 'date' | 'status'>) => void;
  spinUsedToday: boolean;
  setSpinUsedToday: (used: boolean) => void;
}

const daysOfWeek: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const getCurrentDay = (): DayOfWeek => {
  const dayIndex = new Date().getDay();
  // Convert from Sunday = 0 to Monday = 0
  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return daysOfWeek[adjustedIndex];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('coins');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [checkedInDays, setCheckedInDays] = useState<DayOfWeek[]>(() => {
    const saved = localStorage.getItem('checkedInDays');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [watchedAdsToday, setWatchedAdsToday] = useState<number>(() => {
    const saved = localStorage.getItem('watchedAdsToday');
    const savedDate = localStorage.getItem('watchedAdsDate');
    const today = new Date().toDateString();
    
    if (saved && savedDate === today) {
      return parseInt(saved, 10);
    }
    return 0;
  });
  
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRecord[]>(() => {
    const saved = localStorage.getItem('withdrawalHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [spinUsedToday, setSpinUsedToday] = useState<boolean>(() => {
    const saved = localStorage.getItem('spinUsedToday');
    const savedDate = localStorage.getItem('spinUsedDate');
    const today = new Date().toDateString();
    
    if (saved && savedDate === today) {
      return JSON.parse(saved);
    }
    return false;
  });
  
  const currentDay = getCurrentDay();
  const canWatchMoreAds = watchedAdsToday < 5;
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
  }, [coins]);
  
  useEffect(() => {
    localStorage.setItem('checkedInDays', JSON.stringify(checkedInDays));
  }, [checkedInDays]);
  
  useEffect(() => {
    localStorage.setItem('watchedAdsToday', watchedAdsToday.toString());
    localStorage.setItem('watchedAdsDate', new Date().toDateString());
  }, [watchedAdsToday]);
  
  useEffect(() => {
    localStorage.setItem('withdrawalHistory', JSON.stringify(withdrawalHistory));
  }, [withdrawalHistory]);

  useEffect(() => {
    localStorage.setItem('spinUsedToday', JSON.stringify(spinUsedToday));
    localStorage.setItem('spinUsedDate', new Date().toDateString());
  }, [spinUsedToday]);
  
  // Reset daily counters at midnight
  useEffect(() => {
    const checkDate = () => {
      const lastDate = localStorage.getItem('lastDate');
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        setWatchedAdsToday(0);
        setSpinUsedToday(false);
        localStorage.setItem('lastDate', today);
      }
    };
    
    checkDate();
    
    const intervalId = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);
  
  const addCoins = (amount: number) => {
    setCoins(prevCoins => Math.max(0, prevCoins + amount));
  };
  
  const checkInToday = () => {
    if (!checkedInDays.includes(currentDay)) {
      setCheckedInDays(prev => [...prev, currentDay]);
      // 10 coins for checking in
      addCoins(10);
    }
  };
  
  const incrementWatchedAds = () => {
    if (canWatchMoreAds) {
      setWatchedAdsToday(prev => prev + 1);
      // 2 coins per ad watched
      addCoins(2);
    }
  };
  
  const addWithdrawalRecord = (record: Omit<WithdrawalRecord, 'id' | 'date' | 'status'>) => {
    const newRecord: WithdrawalRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    setWithdrawalHistory(prev => [newRecord, ...prev]);
    // Deduct coins
    addCoins(-record.amount);
  };
  
  return (
    <AppContext.Provider
      value={{
        coins,
        addCoins,
        currentDay,
        checkedInDays,
        checkInToday,
        watchedAdsToday,
        incrementWatchedAds,
        canWatchMoreAds,
        withdrawalHistory,
        addWithdrawalRecord,
        spinUsedToday,
        setSpinUsedToday
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
