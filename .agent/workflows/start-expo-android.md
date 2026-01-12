---
description: Start Expo development server for Android emulator
---
// turbo-all

1. Kill any existing process on port 8081:
```powershell
netstat -ano | findstr :8081
taskkill /F /PID <PID_FROM_ABOVE>
```

2. Start Expo server:
```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; & "C:\Program Files\nodejs\npx.cmd" expo start --go --port 8081
```

3. Map port to Android emulator and open Expo Go:
```powershell
$env:PATH = "C:\Users\Admin\AppData\Local\Android\Sdk\platform-tools;" + $env:PATH; adb reverse tcp:8081 tcp:8081; adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"
```
