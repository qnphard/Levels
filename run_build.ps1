# Run the build with temporary environment variables
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:PATH;C:\Program Files\Android\Android Studio\jbr\bin;C:\Users\Admin\AppData\Local\Android\Sdk\platform-tools"

# Verify variables in this session
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"

# Run the build
npx expo run:android
