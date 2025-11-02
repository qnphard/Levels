/**
 * Install Termux on gbox device using ADB
 * First fetches ADB endpoint from gbox API, then installs Termux APK
 */

import { execSync } from 'child_process';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const API_KEY = 'gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0';
const BOX_ID = '84cb6440-75e6-47cc-80f1-4ceefe13dd4e';

// Termux APK URLs to try
const TERMUX_APK_URLS = [
  'https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_arm64-v8a.apk',
  'https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_armeabi-v7a.apk',
  'https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_x86_64.apk',
];

async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadFile(response.headers.location!, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function getBoxInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.gbox.ai',
      path: `/v1/boxes/${BOX_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`API returned ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function installTermux() {
  try {
    console.log('📱 Installing Termux on gbox device...\n');

    // Step 1: Get ADB endpoint from gbox API
    console.log('1️⃣ Fetching box info from gbox.ai...');
    let adbEndpoint: string | null = null;
    
    try {
      const boxInfo = await getBoxInfo();
      console.log('✓ Box info retrieved');
      
      // Try to find ADB endpoint in various possible fields
      if (boxInfo.adbEndpoint) {
        adbEndpoint = boxInfo.adbEndpoint;
      } else if (boxInfo.adb) {
        adbEndpoint = boxInfo.adb;
      } else if (boxInfo.connection?.adb) {
        adbEndpoint = boxInfo.connection.adb;
      } else if (boxInfo.network?.adb) {
        adbEndpoint = boxInfo.network.adb;
      }
      
      if (adbEndpoint) {
        console.log(`✓ Found ADB endpoint: ${adbEndpoint}`);
      } else {
        console.log('⚠️  ADB endpoint not found in API response');
        console.log('   Response keys:', Object.keys(boxInfo));
      }
    } catch (error: any) {
      console.log(`⚠️  Could not fetch from API: ${error.message}`);
      console.log('   Will try common ADB endpoint patterns...\n');
    }

    // If no endpoint found, try common patterns
    if (!adbEndpoint) {
      const possibleEndpoints = [
        `${BOX_ID}.gbox.ai:5555`,
        `gbox-${BOX_ID}.gbox.ai:5555`,
        `adb.us-oregon.gbox.ai:5555`,
        `adb.gbox.ai:5555`,
      ];
      
      console.log('🔍 Trying common ADB endpoint patterns...');
      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`   Trying: ${endpoint}`);
          execSync(`adb connect ${endpoint}`, { stdio: 'ignore', timeout: 5000 });
          const devices = execSync('adb devices', { encoding: 'utf-8' });
          if (devices.includes(endpoint) && devices.includes('device')) {
            adbEndpoint = endpoint;
            console.log(`✓ Connected to: ${endpoint}\n`);
            break;
          }
        } catch (e) {
          // Continue trying
        }
      }
    } else {
      // Connect to the found endpoint
      try {
        console.log(`\n🔌 Connecting to ${adbEndpoint}...`);
        execSync(`adb disconnect ${adbEndpoint}`, { stdio: 'ignore' });
        const connectResult = execSync(`adb connect ${adbEndpoint}`, { encoding: 'utf-8', timeout: 10000 });
        console.log(connectResult.trim());
        
        const devices = execSync('adb devices', { encoding: 'utf-8' });
        if (!devices.includes('device')) {
          throw new Error('Device not showing as connected');
        }
        console.log('✓ Device connected!\n');
      } catch (error: any) {
        throw new Error(`Failed to connect via ADB: ${error.message}`);
      }
    }

    if (!adbEndpoint) {
      throw new Error('Could not determine ADB endpoint. Please provide it manually from gbox.ai dashboard.');
    }

    // Step 2: Download Termux APK
    console.log('2️⃣ Downloading Termux APK...');
    const apkPath = path.join(__dirname, 'termux-temp.apk');
    let downloaded = false;

    for (const url of TERMUX_APK_URLS) {
      try {
        console.log(`   Trying: ${url}`);
        await downloadFile(url, apkPath);
        console.log('✓ APK downloaded!\n');
        downloaded = true;
        break;
      } catch (error: any) {
        console.log(`   Failed: ${error.message}`);
        continue;
      }
    }

    if (!downloaded) {
      throw new Error('Failed to download Termux APK from all sources');
    }

    // Step 3: Install APK via ADB
    console.log('3️⃣ Installing Termux via ADB...');
    try {
      const installResult = execSync(`adb install -r "${apkPath}"`, { 
        encoding: 'utf-8',
        timeout: 60000 
      });
      console.log(installResult.trim());
      console.log('✓ Termux installed successfully!\n');
    } catch (error: any) {
      // Check if it's already installed
      if (error.message.includes('INSTALL_FAILED_ALREADY_EXISTS') || 
          error.message.includes('already installed')) {
        console.log('✓ Termux is already installed!\n');
      } else {
        throw error;
      }
    }

    // Cleanup
    try {
      fs.unlinkSync(apkPath);
    } catch (e) {
      // Ignore cleanup errors
    }

    // Step 4: Open Termux
    console.log('4️⃣ Opening Termux...');
    try {
      execSync('adb shell monkey -p com.termux -c android.intent.category.LAUNCHER 1', {
        stdio: 'ignore',
        timeout: 5000
      });
      console.log('✓ Termux opened!\n');
    } catch (error: any) {
      console.log('⚠️  Could not auto-open Termux (you can open it manually)\n');
    }

    console.log('✅ Setup complete!\n');
    console.log('📋 Next steps in Termux:');
    console.log('   1. Run: pkg update && pkg upgrade');
    console.log('   2. Run: pkg install nodejs npm');
    console.log('   3. Run: npm install -g expo-cli');
    console.log('   4. Clone your project or transfer files');
    console.log('   5. Run: npx expo start');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    console.log('\n💡 Alternative: Install Termux manually');
    console.log('   1. Visit gbox.ai dashboard');
    console.log('   2. Get ADB endpoint for your box');
    console.log('   3. Run: adb connect <endpoint>');
    console.log('   4. Download Termux APK from F-Droid or GitHub');
    console.log('   5. Run: adb install termux.apk');
    process.exit(1);
  }
}

installTermux();

