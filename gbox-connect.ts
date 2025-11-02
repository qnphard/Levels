/**
 * Gbox.ai Connection Script
 * Connects to existing box and sets up ADB connection for Expo testing
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

async function main() {
  try {
    console.log("🔗 Connecting to Gbox.ai...");
    console.log(`Box ID: ${BOX_ID}`);
    console.log("");

    // Get the existing box
    console.log("📦 Retrieving box information...");
    const box = await gboxSDK.get(BOX_ID);

    console.log("✅ Box found!");
    console.log(`   Status: ${box.data.status}`);
    console.log(`   Type: ${box.data.type}`);
    console.log("");

    // Get ADB connection details
    console.log("🔍 Getting ADB connection details...");
    
    // Get box info which should include connection details
    const boxInfo = await gboxSDK.get(BOX_ID);
    
    // Check if box has connection info (this may vary based on SDK version)
    const connectionInfo = (boxInfo.data as any).connection || (boxInfo.data as any).adb || (boxInfo.data as any).endpoint;
    
    if (connectionInfo) {
      console.log("✅ ADB Connection found:");
      console.log(`   ${JSON.stringify(connectionInfo, null, 2)}`);
      console.log("");

      // Extract connection string
      const connectString = typeof connectionInfo === 'string' 
        ? connectionInfo 
        : connectionInfo.host 
          ? `${connectionInfo.host}:${connectionInfo.port || 5555}`
          : null;

      if (connectString) {
        console.log(`🔌 Connecting via ADB: ${connectString}`);
        
        try {
          // Disconnect existing connection if any
          execSync(`adb disconnect ${connectString}`, { stdio: 'ignore' });
        } catch (e) {
          // Ignore errors if not connected
        }

        // Connect
        try {
          const result = execSync(`adb connect ${connectString}`, { encoding: 'utf-8' });
          console.log(`✅ ${result.trim()}`);
          
          // List devices
          console.log("\n📱 Connected devices:");
          const devices = execSync('adb devices', { encoding: 'utf-8' });
          console.log(devices);

          console.log("\n🚀 Next steps:");
          console.log("   1. Run: npm start");
          console.log("   2. Press 'a' in Expo CLI to open on Android");
          console.log("   3. Or run: npx expo start --android");
        } catch (error: any) {
          console.error("❌ ADB connection failed:", error.message);
          console.log("\n💡 You may need to manually connect:");
          console.log(`   adb connect ${connectString}`);
        }
      } else {
        console.log("⚠️  Could not extract connection string from box info");
        console.log("   Full box data:", JSON.stringify(boxInfo.data, null, 2));
      }
    } else {
      console.log("⚠️  ADB connection info not found in box data");
      console.log("   Full box data:", JSON.stringify(boxInfo.data, null, 2));
      console.log("\n💡 Try checking the gbox.ai dashboard for connection details");
    }

    // Take a screenshot to verify box is accessible
    console.log("\n📸 Taking screenshot to verify box is accessible...");
    try {
      await box.action.screenshot({
        path: "gbox-screenshot.png",
      });
      console.log("✅ Screenshot saved: gbox-screenshot.png");
    } catch (error: any) {
      console.log("⚠️  Could not take screenshot:", error.message);
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("   Response:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("\n💡 Troubleshooting:");
    console.log("   1. Verify the API key is correct in .env file");
    console.log("   2. Check if the box is running on gbox.ai dashboard");
    console.log("   3. Ensure you have internet connection");
  }
}

main();

