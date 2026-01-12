# Gbox.ai Connection Guide

## Current Setup

- **Box ID**: `f28be75f-90d2-41a0-9789-b525b6006180`
- **API Key**: Configured in `.env` file
- **Status**: ✅ Box is running
- **Region**: us-oregon
- **Live View**: https://gbox.ai/share/live-view/tmp_5f11efb3810a48de8d0c5b3a8d6c6862

## Finding the ADB Connection Endpoint

The ADB connection endpoint is **not available directly via the SDK**. You need to get it from the gbox.ai dashboard:

### Steps:

1. **Visit** https://gbox.ai and log in
2. **Navigate** to your box (ID: `f28be75f-90d2-41a0-9789-b525b6006180`)
3. **Look for** one of these sections:
   - "ADB Connection"
   - "Connect via ADB"
   - "Network Access"
   - "Remote Access"
   - "Connection Details"
   - "Connect" button/section

4. **Copy** the connection string - it should look like:
   - `xxx.gbox.ai:xxxxx`
   - `xxx.xxx.xxx.xxx:xxxxx` (IP address)
   - Or similar format

## Connecting via ADB

Once you have the endpoint, run:

```bash
# Connect to the gbox device
adb connect <endpoint>:<port>

# Verify connection
adb devices
```

You should see your gbox device listed like:
```
List of devices attached
<endpoint>:<port>    device
```

## Starting Expo Development

After ADB connection is established:

```bash
# Start Expo dev server
npm start

# In Expo CLI, press 'a' to open on Android
# Or run directly:
npx expo start --android
```

## Automated Setup Script

If you have the ADB endpoint, you can update the script:

1. Edit `gbox-connect-final.ts` (create it)
2. Add the endpoint
3. Run: `npx tsx gbox-connect-final.ts`

## Monitoring & Debugging

### View Logs
```bash
# All logs
adb logcat

# Filter for React Native
adb logcat | grep ReactNativeJS

# Filter for errors only
adb logcat *:E
```

### Take Screenshots
```bash
adb exec-out screencap -p > screenshot.png
```

### Install APK Directly
```bash
# If you build an APK
adb install your-app.apk
```

## Troubleshooting

### Device Not Showing
- Check if box is running: Visit gbox.ai dashboard
- Verify ADB connection: `adb devices`
- Try reconnecting: `adb disconnect` then `adb connect <endpoint>`

### Expo Can't Find Device
- Make sure ADB connection is active (`adb devices` shows device)
- Restart Expo dev server
- Try: `npx expo start -c` (clear cache)

### Connection Refused
- Verify the endpoint is correct
- Check if the box is still running
- Ensure your network can reach gbox.ai

## Next Steps After Connection

1. ✅ Connect via ADB (once you have the endpoint)
2. ✅ Verify connection (`adb devices`)
3. ✅ Start Expo (`npm start`)
4. ✅ Open app on Android (press 'a')
5. ✅ Test theme switching and other features
6. ✅ Monitor logs for errors

---

**Please provide the ADB connection endpoint from your gbox.ai dashboard, and I'll help you connect!**





