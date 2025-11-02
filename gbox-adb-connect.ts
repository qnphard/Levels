/**
 * Gbox.ai ADB Connection Helper
 * Attempts to get ADB connection details through various SDK methods
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

async function getAdbConnection() {
  try {
    console.log("🔍 Searching for ADB connection details...\n");

    // Method 1: Try box.get() with specific endpoint
    const box = await gboxSDK.get(BOX_ID);
    console.log("📦 Box retrieved successfully");
    
    // Check various possible properties
    const boxData = box.data as any;
    console.log("\n🔎 Checking box data for connection info...");
    
    // Method 2: Check if there's a connection method
    if (box.connection) {
      console.log("✅ Found connection method:", typeof box.connection);
    }
    
    // Method 3: Check SDK for ADB-related methods
    console.log("\n📚 Available box methods:");
    const boxMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(box));
    console.log(boxMethods.filter(m => m !== 'constructor').join(", "));
    
    // Method 4: Try to get endpoint from action methods
    console.log("\n🎯 Trying to get connection endpoint...");
    
    // Check if there's an adb property or method
    if ((box as any).adb) {
      console.log("Found ADB property");
      console.log((box as any).adb);
    }
    
    // Method 5: Check action methods for connection info
    if (box.action) {
      console.log("✅ Box has action methods");
      const actionMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(box.action));
      console.log("Action methods:", actionMethods.filter(m => m !== 'constructor').join(", "));
    }
    
    // Common gbox.ai ADB endpoint pattern
    // Often follows: <region>-<box-id>.gbox.ai or similar
    console.log("\n💡 Common ADB connection patterns:");
    console.log("   - Check gbox.ai dashboard for 'ADB Connection' section");
    console.log("   - Look for endpoint like: <host>:<port>");
    console.log("   - Often in format: gbox-<region>.gbox.ai:xxxxx");
    
    console.log("\n📝 To find the connection endpoint:");
    console.log("   1. Visit: https://gbox.ai");
    console.log("   2. Navigate to your box dashboard");
    console.log(`   3. Look for box ID: ${BOX_ID}`);
    console.log("   4. Find 'ADB Connection' or 'Connect' section");
    console.log("   5. Copy the connection string");
    
    return null;
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

// Also try to get it from the web interface URL pattern
async function suggestConnectionPattern() {
  console.log("\n🔗 Possible connection patterns based on box info:");
  
  const box = await gboxSDK.get(BOX_ID);
  const boxData = box.data as any;
  const region = boxData.config?.labels?.["gbox.ai/region"] || "us-oregon";
  
  console.log(`   Region: ${region}`);
  console.log(`   Box ID: ${BOX_ID}`);
  console.log("\n💡 Try these patterns:");
  console.log(`   adb connect ${BOX_ID}.gbox.ai:5555`);
  console.log(`   adb connect ${region}.gbox.ai:5555`);
  console.log(`   adb connect gbox-${region}.gbox.ai:5555`);
  console.log("\n   Or check the gbox.ai dashboard for the exact endpoint");
}

async function main() {
  await getAdbConnection();
  await suggestConnectionPattern();
  
  console.log("\n🚀 Once you have the endpoint, connect with:");
  console.log("   adb connect <endpoint>:<port>");
  console.log("   adb devices");
  console.log("   npm start");
}

main();





