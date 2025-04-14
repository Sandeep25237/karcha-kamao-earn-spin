
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
  // Setting this to false to force production ads
  // आप इसे true या false कर सकते हैं अपने हिसाब से
  return false; // false होने पर production ads show होंगे
};

/**
 * Get the appropriate ad unit ID based on environment
 */
export const getAdUnitId = (): string => {
  if (shouldUseTestAds()) {
    console.log("Using test ad units for development");
    return ADMOB_CONFIG.TEST_REWARDED_AD;
  }
  console.log("Using production ad unit ID:", ADMOB_CONFIG.AD_UNIT_ID);
  return ADMOB_CONFIG.AD_UNIT_ID;
};
