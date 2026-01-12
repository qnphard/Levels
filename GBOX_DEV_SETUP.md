# Gbox Development Client Setup

## Quick Setup Steps

### 1. Connect to New Box
- Box ID: `84cb6440-75e6-47cc-80f1-4ceefe13dd4e`
- After restarting Cursor, the MCP server should auto-connect

### 2. Development Client APK
- **Download URL**: https://expo.dev/artifacts/eas/tUU3xDoVznsgXbuaRcDC5i.apk
- This is a development build that can connect to the Expo dev server

### 3. Start Expo Dev Server
```bash
npx expo start --tunnel
```

This will:
- Start Metro bundler
- Create a tunnel URL (accessible from anywhere)
- Display a QR code and connection URL

### 4. Install Development Client on Gbox
Once the MCP connection is restored, I can:
- Install the APK automatically
- Connect the app to the dev server
- Enable real-time testing

### 5. Real-time Testing
Once connected:
- Code changes will hot-reload automatically
- No need to rebuild APK for each change
- See changes instantly on the device

## Manual Installation (if MCP isn't working)
1. Download the APK from the URL above
2. Install it on the gbox device (via dashboard or ADB)
3. Open the app - it should show a connection screen
4. Enter the dev server URL from `expo start --tunnel`
5. The app will connect and load your code

## Troubleshooting
- **MCP Connection**: Restart Cursor to reload MCP servers
- **Dev Server**: Make sure `expo start --tunnel` is running
- **App Not Connecting**: Check the tunnel URL is accessible




