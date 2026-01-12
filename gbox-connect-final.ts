/**
 * Final Gbox.ai Connection Script
 * Update the ADB_ENDPOINT variable with the connection string from gbox.ai dashboard
 */

import { execSync } from "child_process";

// ⚠️ UPDATE THIS WITH THE ADB ENDPOINT FROM GBOX.AI DASHBOARD
// Format: "host:port" (e.g., "xxx.gbox.ai:5555" or "192.168.1.1:5555")
const ADB_ENDPOINT = ""; // <-- ADD THE ENDPOINT HERE

const BOX_ID = "f28be75f-90d2-41a0-9789-b525b6006180";

async function main() {
  if (!ADB_ENDPOINT || ADB_ENDPOINT.trim() === "") {
    console.log("❌ ADB endpoint not configured!\n");
    console.log("📝 Steps to configure:");
    console.log("   1. Visit https://gbox.ai");
    console.log(`   2. Find your box: ${BOX_ID}`);
    console.log("   3. Look for 'ADB Connection' section");
    console.log("   4. Copy the connection string");
    console.log("   5. Update ADB_ENDPOINT in this file\n");
    console.log("   Example: const ADB_ENDPOINT = 'xxx.gbox.ai:5555';");
    return;
  }

  try {
    console.log("🔗 Connecting to Gbox.ai Android device...\n");
    console.log(`Endpoint: ${ADB_ENDPOINT}`);
    console.log(`Box ID: ${BOX_ID}\n`);

    // Check ADB
    try {
      const adbVersion = execSync("adb version", { encoding: "utf-8" });
      console.log("✅ ADB found");
    } catch (e) {
      console.error("❌ ADB not found. Please install Android SDK platform-tools.");
      return;
    }

    // Disconnect existing connection if any
    console.log("Disconnecting any existing connection...");
    try {
      execSync(`adb disconnect ${ADB_ENDPOINT}`, { stdio: "ignore" });
    } catch (e) {
      // Ignore errors
    }

    // Connect
    console.log(`\n🔌 Connecting to ${ADB_ENDPOINT}...`);
    const connectResult = execSync(`adb connect ${ADB_ENDPOINT}`, {
      encoding: "utf-8",
    });
    console.log(connectResult.trim());

    // Verify
    console.log("\n📱 Connected devices:");
    const devices = execSync("adb devices", { encoding: "utf-8" });
    console.log(devices);

    // Check if device is connected
    if (devices.includes(ADB_ENDPOINT) && devices.includes("device")) {
      console.log("\n✅ Successfully connected!");
      console.log("\n🚀 Next steps:");
      console.log("   1. Start Expo: npm start");
      console.log("   2. Press 'a' to open on Android");
      console.log("   3. Or run: npx expo start --android");
      console.log("\n📊 Monitor logs:");
      console.log("   adb logcat | grep ReactNativeJS");
    } else {
      console.log("\n⚠️  Device connected but may not be ready");
      console.log("   Wait a few seconds and check again: adb devices");
    }
  } catch (error: any) {
    console.error("\n❌ Connection failed:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("   - Verify the endpoint is correct");
    console.log("   - Check if box is running on gbox.ai");
    console.log("   - Ensure your network can reach gbox.ai");
  }
}

main();





