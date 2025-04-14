
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7e296c502ede4ff5acd12e8a95dc5bfb',
  appName: 'karcha-kamao-earn-spin',
  webDir: 'dist',
  server: {
    url: 'https://7e296c50-2ede-4ff5-acd1-2e8a95dc5bfb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    }
  }
};

export default config;
