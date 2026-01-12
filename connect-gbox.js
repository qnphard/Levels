/**
 * Gbox.ai Connection Helper
 * This script helps connect to a remote Android emulator on gbox.ai
 */

const boxId = 'f28be75f-90d2-41a0-9789-b525b6006180';
const apiKey = 'gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0';

console.log('🔗 Connecting to gbox.ai...');
console.log(`Box ID: ${boxId}`);
console.log('\n📝 Instructions:');
console.log('1. Make sure the gbox.ai device is running and accessible');
console.log('2. Check the gbox.ai dashboard for ADB connection details');
console.log('3. Typically, gbox.ai provides an ADB endpoint like:');
console.log('   adb connect <gbox-endpoint>:<port>');
console.log('\n💡 To get the connection details:');
console.log(`   Visit: https://gbox.ai and check your box configuration`);
console.log(`   Box ID: ${boxId}`);
console.log('\n🔧 Once you have the ADB endpoint, run:');
console.log('   adb connect <endpoint>:<port>');
console.log('   adb devices');
console.log('\n🚀 Then start Expo with:');
console.log('   npm start');
console.log('   Press "a" to open on Android device');
console.log('\n📋 API Key (save securely):');
console.log(`   ${apiKey.substring(0, 20)}...`);





