import { GboxSDK } from 'gbox-sdk';

const API_KEY = 'gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0';
const BOX_ID = '84cb6440-75e6-47cc-80f1-4ceefe13dd4e';
const DEV_APK_URL = 'https://expo.dev/artifacts/eas/tUU3xDoVznsgXbuaRcDC5i.apk';

async function connectAndSetup() {
  try {
    console.log('Initializing Gbox SDK...');
    const sdk = new GboxSDK({
      apiKey: API_KEY,
    });

    console.log(`Connecting to box: ${BOX_ID}`);
    const box = await sdk.startBox(BOX_ID);
    console.log('✓ Box connected successfully!');
    console.log(`Live view URL: ${box.liveViewUrl || 'N/A'}`);

    console.log('\nInstalling development client...');
    const installResult = await box.installApk(DEV_APK_URL, { open: true });
    console.log('✓ Development client installed!');
    console.log(`Package: ${installResult.packageName}`);

    console.log('\n✓ Setup complete! The app should now be running.');
    console.log('Make sure your Expo dev server is running with: npx expo start --tunnel');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

connectAndSetup();




