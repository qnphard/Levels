# Gbox.ai Setup Guide

This guide will help you connect to your remote Android emulator on gbox.ai for testing.

## Connection Details

- **Box ID**: `f28be75f-90d2-41a0-9789-b525b6006180`
- **API Key**: `gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0`

## Steps to Connect

### Option 1: Via Gbox.ai Web Interface

1. Visit https://gbox.ai and log in
2. Navigate to your box with ID: `f28be75f-90d2-41a0-9789-b525b6006180`
3. Look for "ADB Connection" or "Connect via ADB" section
4. Copy the connection string (usually looks like `gbox-xxx.gbox.ai:xxxxx` or an IP address)

### Option 2: Via API (if supported)

If gbox.ai provides API endpoints, you may need to:
1. Use the API key to authenticate
2. Get the device connection details
3. Connect via ADB

### Connect via ADB

Once you have the connection endpoint:

```bash
# Connect to the remote device
adb connect <endpoint>:<port>

# Verify connection
adb devices
```

You should see your gbox device listed.

### Start Development Server

```bash
# Start Expo development server
npm start

# In the Expo CLI, press 'a' to open on Android
# Or run directly:
npx expo start --android
```

## Testing Workflow

1. **Connect to gbox.ai device** via ADB
2. **Start Expo dev server** (`npm start`)
3. **Open app on Android** (press 'a' in Expo CLI)
4. **Monitor logs**: 
   ```bash
   adb logcat | grep "ReactNativeJS"
   ```

## Troubleshooting

### Device Not Showing
- Check if the box is running on gbox.ai dashboard
- Verify ADB connection: `adb devices`
- Try disconnecting and reconnecting: `adb disconnect` then `adb connect <endpoint>`

### Expo Can't Find Device
- Make sure ADB connection is established (`adb devices` shows the device)
- Try restarting the Expo dev server
- Check if USB debugging is enabled (if applicable)

### Connection Issues
- Verify your network connection
- Check if gbox.ai requires VPN or specific network setup
- Ensure the API key is valid and has proper permissions

## API Key Security

⚠️ **Important**: The API key is sensitive. Do not commit it to version control.

If you need to store it securely:
- Use environment variables
- Add to `.gitignore`
- Consider using a secrets manager for production

## Next Steps

Once connected, you can:
- Test theme switching in real-time
- Debug layout issues
- Monitor performance
- Test on different Android versions/configurations available on gbox.ai





