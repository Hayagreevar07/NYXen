import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nyxen.app',
  appName: 'Nyxen',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['10.175.4.117:3001', 'localhost:3001', '10.0.2.2:3001'],
  },
};

export default config;
