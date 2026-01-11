/**
 * Get ADB connection endpoint from gbox.ai box
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
    console.log("🔍 Getting ADB connection endpoint from gbox.ai...\n");
    
    const box = await gboxSDK.get(BOX_ID);
    console.log("✅ Box is running");
    
    // Try to get live view URL which might contain connection info
    console.log("\n📺 Getting live view URL...");
    try {
      const liveView = await (box as any).liveView();
      console.log("Live view URL:", liveView.url || liveView);
    } catch (e: any) {
      console.log("Could not get live view:", e.message);
    }
    
    // Check if box has adb property
    console.log("\n🔎 Checking for ADB connection method...");
    const boxAny = box as any;
    
    // Try various possible methods
    if (boxAny.adb) {
      console.log("Found adb property:", boxAny.adb);
    }
    
    if (boxAny.connection) {
      console.log("Found connection property:", boxAny.connection);
    }
    
    if (boxAny.getConnection) {
      const conn = await boxAny.getConnection();
      console.log("getConnection() result:", conn);
    }
    
    if (boxAny.getAdbEndpoint) {
      const endpoint = await boxAny.getAdbEndpoint();
      console.log("ADB endpoint:", endpoint);
    }
    
    // Check SDK client for connection methods
    console.log("\n📚 Checking SDK for connection methods...");
    const sdkAny = gboxSDK as any;
    if (sdkAny.client) {
      const clientMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(sdkAny.client));
      console.log("Client methods:", clientMethods.filter((m: string) => !m.startsWith('_')).join(", "));
    }
    
    console.log("\n💡 If ADB endpoint is not found via SDK:");
    console.log("   1. Visit https://gbox.ai dashboard");
    console.log("   2. Find your box and look for 'ADB Connection' section");
    console.log("   3. Common format: <host>:<port>");
    console.log("   4. Then run: adb connect <host>:<port>");
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.error(error);
  }
}

main();





