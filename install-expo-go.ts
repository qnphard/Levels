/**
 * Script to install Expo Go on gbox.ai device
 * Run with: npx tsx install-expo-go.ts
 */

import { GboxSDK } from 'gbox-sdk';

const API_KEY = 'gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0';
const BOX_ID = '84cb6440-75e6-47cc-80f1-4ceefe13dd4e';

// Latest Expo Go APK URL (you may need to update this)
// Check https://github.com/expo/expo/releases for the latest version
const EXPO_GO_APK_URL = 'https://d1ahtucjixef4r.cloudfront.net/Exponent-2.28.8.apk';

async function installExpoGo() {
  try {
    console.log('Initializing Gbox SDK...');
    const sdk = new GboxSDK({
      apiKey: API_KEY,
    });

    console.log(`Connecting to box: ${BOX_ID}`);
    const box = await sdk.startBox(BOX_ID);
    console.log('✓ Box connected successfully!');

    console.log('\nInstalling Expo Go...');
    const result = await box.installApk(EXPO_GO_APK_URL, { open: true });
    console.log('✓ Expo Go installed successfully!');
    console.log(`Package: ${result.packageName}`);
    console.log(`Activity: ${result.activityName}`);

    console.log('\n✓ Setup complete! Expo Go should now be open on your device.');
    console.log('\nNext steps:');
    console.log('1. Make sure your Expo dev server is running: npx expo start --tunnel');
    console.log('2. Open Expo Go on the device');
    console.log('3. Scan the QR code or enter the connection URL');
    
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

installExpoGo();



