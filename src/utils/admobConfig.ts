
/**
 * AdMob Configuration for the app
 */

export const ADMOB_CONFIG = {
  APP_ID: 'ca-app-pub-9884257131349852~8583116889',
  AD_UNIT_ID: 'ca-app-pub-9884257131349852/9475727853',
  
  // Test Ad Units (for development only)
  TEST_BANNER_AD: 'ca-app-pub-3940256099942544/6300978111',
  TEST_INTERSTITIAL_AD: 'ca-app-pub-3940256099942544/1033173712',
  TEST_REWARDED_AD: 'ca-app-pub-3940256099942544/5224354917',
};

/**
 * Determines if we should use test ads (typically in development)
 */
export const shouldUseTestAds = (): boolean => {
  // Use test ads in development mode
  return process.env.NODE_ENV === 'development';
};

/**
 * Get the appropriate ad unit ID based on environment
 */
export const getAdUnitId = (): string => {
  return shouldUseTestAds() ? ADMOB_CONFIG.TEST_REWARDED_AD : ADMOB_CONFIG.AD_UNIT_ID;
};
