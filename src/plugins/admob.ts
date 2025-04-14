
import { registerPlugin } from '@capacitor/core';

export interface AdMobPlugin {
  initialize(options: { appId: string }): Promise<void>;
  showRewardedAd(options: { adUnitId: string }): Promise<{ rewarded: boolean }>;
}

const AdMob = registerPlugin<AdMobPlugin>('AdMob');

export default AdMob;
