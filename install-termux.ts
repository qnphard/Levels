/**
 * Script to install Termux on gbox.ai device
 * Run with: npx tsx install-termux.ts
 */

import { GboxSDK } from 'gbox-sdk';

const API_KEY = 'gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0';
const BOX_ID = '84cb6440-75e6-47cc-80f1-4ceefe13dd4e';

// Termux APK URLs (try multiple sources)
const TERMUX_APK_URLS = [
  // F-Droid direct download (latest stable)
  'https://f-droid.org/repo/com.termux_118.apk',
  // GitHub release (arm64-v8a - most common for Android devices)
  'https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_arm64-v8a.apk',
  // Alternative GitHub release
  'https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_armeabi-v7a.apk',
];

async function installTermux() {
  try {
    console.log('Initializing Gbox SDK...');
    const sdk = new GboxSDK({
      apiKey: API_KEY,
    });

    console.log(`Connecting to box: ${BOX_ID}`);
    const box = await sdk.startBox(BOX_ID);
    console.log('✓ Box connected successfully!');

    // Try installing from different sources
    for (const apkUrl of TERMUX_APK_URLS) {
      try {
        console.log(`\nTrying to install Termux from: ${apkUrl}`);
        const result = await box.installApk(apkUrl, { open: false });
        console.log('✓ Termux installed successfully!');
        console.log(`Package: ${result.packageName}`);
        console.log(`Activity: ${result.activityName}`);
        
        console.log('\n✓ Setup complete! Termux is now installed.');
        console.log('\nNext steps:');
        console.log('1. Open Termux on the device');
        console.log('2. Run: pkg update && pkg upgrade');
        console.log('3. Run: pkg install nodejs npm');
        console.log('4. Run: npm install -g expo-cli');
        console.log('5. Navigate to your project and run: npx expo start');
        return;
      } catch (error: any) {
        console.log(`Failed with this URL: ${error.message}`);
        continue;
      }
    }
    
    throw new Error('All Termux APK URLs failed');
    
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    console.log('\nAlternative: Install Termux manually via:');
    console.log('1. Open Play Store on gbox device');
    console.log('2. Search for "Termux"');
    console.log('3. Install (or use F-Droid for latest version)');
    process.exit(1);
  }
}

installTermux();


