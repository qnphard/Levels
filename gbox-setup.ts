/**
 * Complete Gbox.ai Setup Script
 * Connects to gbox.ai box and sets up ADB for Expo testing
 */

import GboxSDK from "gbox-sdk";
import * as dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config();

const BOX_ID = "f28be75f-90d2-41a0-9789-b525b6006180";
const API_KEY = process.env["GBOX_API_KEY"] || "gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0";

const gboxSDK = new GboxSDK({
  apiKey: API_KEY,
});

async function tryCommonAdbPatterns(boxId: string, region?: string) {
  const patterns = [
    `${boxId}.gbox.ai:5555`,
    `gbox-${region || 'us-oregon'}.gbox.ai:5555`,
    `${boxId.substring(0, 8)}.gbox.ai:5555`,
    `adb.${region || 'us-oregon'}.gbox.ai:5555`,
  ];
  
  console.log("🔍 Trying common ADB connection patterns...\n");
  
  for (const pattern of patterns) {
    try {
      console.log(`Trying: ${pattern}`);
      execSync(`adb disconnect ${pattern}`, { stdio: 'ignore' });
      const result = execSync(`adb connect ${pattern}`, { encoding: 'utf-8', stdio: 'pipe' });
      if (result.includes('connected') || result.includes('already connected')) {
        console.log(`✅ Success! Connected to: ${pattern}\n`);
        return pattern;
      }
    } catch (e) {
      // Continue to next pattern
    }
  }
  
  return null;
}

async function main() {
  try {
    console.log("🚀 Gbox.ai Setup for Expo Testing\n");
    console.log(`Box ID: ${BOX_ID}`);
    console.log(`Live View: https://gbox.ai/share/live-view/tmp_5f11efb3810a48de8d0c5b3a8d6c6862\n`);
    
    // Get box info
    const box = await gboxSDK.get(BOX_ID);
    const boxData = box.data as any;
    const region = boxData.config?.labels?.["gbox.ai/region"] || "us-oregon";
    
    console.log("📦 Box Status:", boxData.status);
    console.log("🌍 Region:", region);
    console.log("");
    
    // Try common patterns
    const connected = await tryCommonAdbPatterns(BOX_ID, region);
    
    if (!connected) {
      console.log("❌ Could not auto-connect with common patterns\n");
      console.log("📝 Manual Connection Steps:");
      console.log("   1. Visit: https://gbox.ai");
      console.log("   2. Log in and find your box");
      console.log("   3. Look for 'ADB Connection' or 'Connect via ADB' section");
      console.log("   4. Copy the connection string (format: host:port)");
      console.log("   5. Run: adb connect <connection-string>");
      console.log("\n💡 Common locations in dashboard:");
      console.log("   - Device/Box details page");
      console.log("   - Connection/Network settings");
      console.log("   - 'Connect' or 'Access' button/menu");
    } else {
      // Verify connection
      console.log("📱 Verifying connection...");
      const devices = execSync('adb devices', { encoding: 'utf-8' });
      console.log(devices);
      
      console.log("\n✅ Setup Complete!");
      console.log("\n🚀 Next steps:");
      console.log("   1. Start Expo dev server: npm start");
      console.log("   2. Press 'a' to open on Android device");
      console.log("   3. Or run: npx expo start --android");
      console.log("\n📊 To monitor logs:");
      console.log("   adb logcat | grep ReactNativeJS");
    }
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

main();





