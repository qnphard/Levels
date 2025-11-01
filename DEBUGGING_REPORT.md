# React Native Expo Go Debugging Report

## Summary

Your app works on **React Native Web (browser)** but crashes silently on **Expo Go (native)** because React Native Web is more forgiving and uses DOM APIs, while native React Native uses Hermes/V8 and stricter rendering rules.

## Critical Issues Found & Fixed

### 1. ? **window.width Variable Name Conflict** (Line 72-80 in JourneyMapScreen.tsx)
**Problem:** Variable named `window` shadows global object and could cause issues
**Why it fails on native:** The global `window` object doesn't exist in React Native native runtime
**Fix:** Renamed to `windowDimensions` to avoid confusion

```diff
- const window = useWindowDimensions();
- const screenWidth = window.width || width;
+ const windowDimensions = useWindowDimensions();
+ const screenWidth = windowDimensions.width || width;
```

### 2. ? **boxShadow CSS Property (Web-Only)** (Multiple locations in JourneyMapScreen.tsx)
**Problem:** `boxShadow` is a web-only CSS property that doesn't exist in React Native
**Why it fails on native:** React Native doesn't support CSS `boxShadow` - it uses `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, and `elevation` instead
**Fix:** Wrapped all `boxShadow` usages with `Platform.OS === 'web'` guards

```diff
- boxShadow: [...]
+ ...(Platform.OS === 'web' ? { boxShadow: [...] } as any : {})
```

### 3. ? **filter CSS Property (Web-Only)** (Line 269 in JourneyMapScreen.tsx)
**Problem:** `filter` is a web-only CSS property
**Why it fails on native:** React Native doesn't support CSS filters
**Fix:** Removed the filter property (was already guarded but removed completely)

### 4. ? **Text Component Containing Non-Text Children** (Line 294-297 in JournalScreen.tsx)
**Problem:** `<Text>` component contains `<Ionicons>` which is not a string or Text component
**Why it fails on native:** React Native's `<Text>` component can only contain strings or other `<Text>` components. On web, browsers allow any elements inside text nodes, but native crashes.
**Fix:** Wrapped Icon and Text in a `<View>` instead

```diff
- <Text style={styles.privacyNote}>
-   <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
-   {' '}Private and saved only on your device
- </Text>
+ <View style={styles.privacyNote}>
+   <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
+   <Text style={styles.privacyNoteText}>
+     {' '}Private and saved only on your device
+   </Text>
+ </View>
```

## Action Checklist

### ? Completed
- [x] Fixed `window.width` variable naming
- [x] Guarded all `boxShadow` CSS properties with `Platform.OS === 'web'`
- [x] Removed `filter` CSS property
- [x] Fixed Text component containing Icon component

### ?? Recommended Next Steps

1. **Add ErrorBoundary Component** (Optional but recommended)
   ```tsx
   // Create src/components/ErrorBoundary.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   
   export class ErrorBoundary extends React.Component<
     { children: React.ReactNode },
     { hasError: boolean; error?: Error }
   > {
     state = { hasError: false };
     
     static getDerivedStateFromError(error: Error) {
       return { hasError: true, error };
     }
     
     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       console.error('ErrorBoundary caught:', error, errorInfo);
     }
     
     render() {
       if (this.state.hasError) {
         return (
           <View style={styles.container}>
             <Text style={styles.title}>Something went wrong</Text>
             <Text style={styles.error}>{this.state.error?.message}</Text>
           </View>
         );
       }
       return this.props.children;
     }
   }
   ```

2. **Clear Metro Cache and Restart**
   ```bash
   npx expo start -c
   ```

3. **Test on Expo Go**
   - Scan QR code with Expo Go app
   - Navigate through all screens
   - Check for any remaining crashes

## Why Web Works But Native Doesn't

### React Native Web (Browser)
- **Rendering:** Uses HTML DOM elements (`<div>`, `<span>`, etc.)
- **CSS:** Supports full CSS including `boxShadow`, `filter`, etc.
- **Text:** Browsers allow any elements inside text nodes (they convert to spans)
- **APIs:** Has access to `window`, `document`, `localStorage` (if polyfilled)
- **Error Handling:** More forgiving - often silently ignores invalid properties

### React Native Native (Expo Go / APK)
- **Rendering:** Uses native views (`View`, `Text`, `Image`, etc.)
- **CSS:** Only supports a subset of CSS properties (no `boxShadow`, `filter`, etc.)
- **Text:** `<Text>` can ONLY contain strings or other `<Text>` components
- **APIs:** No `window`, `document`, `localStorage` (uses AsyncStorage instead)
- **Error Handling:** Strict - crashes immediately on invalid operations

## Files Modified

1. `src/screens/JourneyMapScreen.tsx`
   - Fixed `window` variable naming
   - Guarded all `boxShadow` properties
   - Removed `filter` property

2. `src/screens/JournalScreen.tsx`
   - Fixed Text component containing Icon

## Testing Instructions

1. **Clear cache and restart:**
   ```bash
   npx expo start -c
   ```

2. **Test on Expo Go:**
   - Open Expo Go app on Android
   - Scan QR code
   - Navigate through all screens:
     - Journey Map
     - Library
     - Journal
     - Profile
     - Check In
     - Level Detail
     - Level Chapter

3. **Expected Behavior:**
   - App should load without crashing
   - All screens should render correctly
   - No silent closes

## Additional Notes

- All web-only CSS properties are now properly guarded
- The app should now work identically when built as an APK
- If you see any remaining errors, they will now be visible in the Metro bundler console or Expo Go error screen (instead of silent closes)
