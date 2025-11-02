/**
 * Simple script to install Termux via ADB
 * Usage: Set ADB_ENDPOINT below, then run: npx tsx install-termux-simple.ts
 */

import { execSync } from 'child_process';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

// ⚠️ SET THIS FROM GBOX.AI DASHBOARD (format: "host:port")
const ADB_ENDPOINT = ''; // e.g., "xxx.gbox.ai:5555" or "192.168.1.1:5555"

// Termux APK URL (arm64-v8a - most common)
const TERMUX_APK_URL = 'https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_arm64-v8a.apk';

function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return downloadFile(response.headers.location!, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function main() {
  if (!ADB_ENDPOINT || ADB_ENDPOINT.trim() === '') {
    console.log('❌ ADB_ENDPOINT not set!\n');
    console.log('📝 To get the ADB endpoint:');
    console.log('   1. Visit https://gbox.ai');
    console.log('   2. Open your box dashboard');
    console.log('   3. Look for "ADB Connection" or "Device Connection" section');
    console.log('   4. Copy the connection string (format: host:port)');
    console.log('   5. Update ADB_ENDPOINT in this file\n');
    console.log('   Example: const ADB_ENDPOINT = "xxx.gbox.ai:5555";\n');
    return;
  }

  try {
    console.log('📱 Installing Termux on gbox device...\n');

    // Connect via ADB
    console.log(`🔌 Connecting to ${ADB_ENDPOINT}...`);
    try {
      execSync(`adb disconnect ${ADB_ENDPOINT}`, { stdio: 'ignore' });
    } catch (e) {
      // Ignore
    }

    const connectResult = execSync(`adb connect ${ADB_ENDPOINT}`, {
      encoding: 'utf-8',
      timeout: 10000,
    });
    console.log(connectResult.trim());

    // Verify connection
    const devices = execSync('adb devices', { encoding: 'utf-8' });
    if (!devices.includes('device')) {
      throw new Error('Device not properly connected');
    }
    console.log('✓ Connected!\n');

    // Download APK
    console.log('📥 Downloading Termux APK...');
    const apkPath = path.join(__dirname, 'termux-temp.apk');
    await downloadFile(TERMUX_APK_URL, apkPath);
    console.log('✓ Downloaded!\n');

    // Install
    console.log('📦 Installing Termux...');
    try {
      execSync(`adb install -r "${apkPath}"`, {
        encoding: 'utf-8',
        timeout: 60000,
      });
      console.log('✓ Installed!\n');
    } catch (error: any) {
      if (error.message.includes('already installed')) {
        console.log('✓ Already installed!\n');
      } else {
        throw error;
      }
    }

    // Cleanup
    try {
      fs.unlinkSync(apkPath);
    } catch (e) {
      // Ignore
    }

    // Open Termux
    console.log('🚀 Opening Termux...');
    try {
      execSync('adb shell monkey -p com.termux -c android.intent.category.LAUNCHER 1', {
        stdio: 'ignore',
        timeout: 5000,
      });
      console.log('✓ Opened!\n');
    } catch (e) {
      console.log('⚠️  Could not auto-open (open manually)\n');
    }

    console.log('✅ Complete!\n');
    console.log('📋 Next steps in Termux:');
    console.log('   pkg update && pkg upgrade');
    console.log('   pkg install nodejs npm');
    console.log('   npm install -g expo-cli');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack:', error.stack);
    }
    process.exit(1);
  }
}

main();

