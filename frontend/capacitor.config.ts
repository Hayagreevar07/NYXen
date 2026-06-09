import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nyxen.app',
  appName: 'Nyxen',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
