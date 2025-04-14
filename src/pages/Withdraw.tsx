
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { AlertCircle, CheckCircle, IndianRupee, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Withdraw = () => {
  const { coins, addWithdrawalRecord, withdrawalHistory } = useAppContext();
  const [upiId, setUpiId] = useState('');
  const [coinsToWithdraw, setCoinsToWithdraw] = useState('');
  
  const minimumCoins = 1000; // 10 INR
  const conversionRate = 100; // 100 coins = 1 INR
  
  const handleWithdraw = () => {
    const coinsAmount = parseInt(coinsToWithdraw);
    
    // Validation checks
    if (!upiId || !upiId.includes('@')) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    
    if (isNaN(coinsAmount) || coinsAmount < minimumCoins) {
      toast.error(`Minimum withdrawal is ${minimumCoins} coins (₹${minimumCoins / conversionRate})`);
      return;
    }
    
    if (coinsAmount > coins) {
      toast.error("You don't have enough coins for this withdrawal");
      return;
    }
    
    // Process withdrawal
    addWithdrawalRecord({
      amount: coinsAmount,
      upiId: upiId
    });
    
    toast.success("Withdrawal request submitted successfully!");
    
    // Reset form
    setUpiId('');
    setCoinsToWithdraw('');
  };
  
  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-amber-500" />;
  };
  
  const coinsValue = parseInt(coinsToWithdraw) || 0;
  const inrValue = coinsValue / conversionRate;
  
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Withdraw Coins</h1>
        
        <Card className="p-4">
          <div className="mb-4 text-center">
            <p className="text-lg font-semibold">Current Balance</p>
            <p className="text-2xl font-bold text-app-purple">{coins} coins</p>
            <p className="text-sm text-gray-500">
              (₹{(coins / conversionRate).toFixed(2)})
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="upi">UPI ID</Label>
              <Input
                id="upi"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="coins">Coins to Withdraw</Label>
              <Input
                id="coins"
                placeholder="Minimum 1000 coins"
                value={coinsToWithdraw}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setCoinsToWithdraw(value);
                }}
              />
              {coinsValue > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  ≈ ₹{inrValue.toFixed(2)}
                </p>
              )}
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Minimum withdrawal is {minimumCoins} coins (₹{minimumCoins / conversionRate}). 
                Withdrawals are processed within 24 hours.
              </p>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleWithdraw}
              disabled={
                !upiId || 
                !coinsToWithdraw || 
                parseInt(coinsToWithdraw) < minimumCoins ||
                parseInt(coinsToWithdraw) > coins
              }
            >
              Withdraw Now
            </Button>
          </div>
        </Card>
        
        {withdrawalHistory.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Withdrawal History</h3>
            
            <div className="space-y-3">
              {withdrawalHistory.map((record) => (
                <div 
                  key={record.id} 
                  className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{record.upiId}</p>
                      <span className="ml-2 flex items-center">
                        {getStatusIcon(record.status)}
                        <span className="text-xs ml-1 capitalize">
                          {record.status}
                        </span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(record.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1" />
                    <span className="font-medium">
                      {(record.amount / conversionRate).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Withdraw;
