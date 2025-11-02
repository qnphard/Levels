# Android Debugging Guide

## Common Errors and Solutions

### Bluetooth Error (System-Level)

**Error:** `Cannot acquire BluetoothActivityEnergyInfo`

This is a **system-level Android error** that occurs in the emulator or on some devices. It's related to Android's power stats collection system trying to monitor Bluetooth activity.

**Why it happens:**
- Android system services try to collect Bluetooth power statistics
- Emulators often don't have proper Bluetooth support
- Some real devices have Bluetooth stack issues

**Impact on your app:**
- ✅ **Does NOT crash your app** - it's a background system error
- ✅ **Safe to ignore** - your app doesn't use Bluetooth
- ✅ **No action needed** - this is an Android OS issue, not your code

**How to verify it's not your app:**
- Check if your `app.json` has Bluetooth permissions (it doesn't)
- Your app only requests `INTERNET` and `WAKE_LOCK` permissions
- No Bluetooth-related code in your app

**If you want to suppress these logs:**
1. Use `adb logcat` with filters: `adb logcat | grep -v Bluetooth`
2. Or filter in Android Studio Logcat: Add filter excluding "Bluetooth"

### Text Rendering Errors

**Error:** `Text strings must be rendered within a <Text> component`

**Fixed:** All level properties (`name`, `antithesis`, `description`) are now wrapped with `String()` to ensure they're always strings.

### BlurView Crashes on Real Devices

**Fixed:** Created `SafeBlurView` component that falls back to semi-transparent View on Android to avoid hardware bitmap issues.

## Debugging Tips

### View Real Device Logs

```bash
# Connect your phone via USB and enable USB debugging
adb devices

# View all logs
adb logcat

# Filter for your app only
adb logcat | grep "ReactNativeJS"

# Filter for errors only
adb logcat *:E
```

### Common Crash Causes

1. **Missing permissions** - Check `app.json` has required permissions
2. **BlurView on Android** - Use `SafeBlurView` instead
3. **Transform undefined** - Always use `[]` instead of `undefined`
4. **Text rendering** - All values must be strings or wrapped in `<Text>`
5. **Audio URLs** - Validate URLs before loading

### Testing Checklist

- [ ] App launches without crashing
- [ ] Text displays correctly (no truncation)
- [ ] 2 cards per row on mobile screens
- [ ] Audio player works (if audio URLs exist)
- [ ] Navigation works smoothly
- [ ] No console errors


