// Script to get Expo dev server URL
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting Expo server and capturing URL...');

// Start Expo with tunnel and capture output
try {
  const output = execSync('npx expo start --tunnel --json', { 
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: 30000,
    cwd: process.cwd()
  });
  
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('exp://')) {
      const match = line.match(/exp:\/\/[^\s]+/);
      if (match) {
        console.log('EXPO_URL=' + match[0]);
        fs.writeFileSync('expo-url.txt', match[0]);
        process.exit(0);
      }
    }
    // Also check JSON output
    try {
      const json = JSON.parse(line);
      if (json.url) {
        console.log('EXPO_URL=' + json.url);
        fs.writeFileSync('expo-url.txt', json.url);
        process.exit(0);
      }
    } catch (e) {
      // Not JSON, continue
    }
  }
} catch (error) {
  console.error('Error:', error.message);
}


