# PowerShell script to connect to gbox.ai Android emulator
# Run this script after getting the ADB connection details from gbox.ai

param(
    [string]$GboxEndpoint = ""
)

$BoxId = "f28be75f-90d2-41a0-9789-b525b6006180"
$ApiKey = "gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0"

Write-Host "🔗 Gbox.ai Connection Helper" -ForegroundColor Cyan
Write-Host "Box ID: $BoxId" -ForegroundColor Gray
Write-Host ""

# Check if ADB is available
try {
    $adbVersion = adb version 2>&1 | Select-Object -First 1
    Write-Host "✅ ADB found: $adbVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ADB not found. Please install Android SDK platform-tools." -ForegroundColor Red
    Write-Host "   Download from: https://developer.android.com/studio/releases/platform-tools" -ForegroundColor Yellow
    exit 1
}

# If endpoint not provided, ask user
if ([string]::IsNullOrEmpty($GboxEndpoint)) {
    Write-Host "📝 To get the ADB connection endpoint:" -ForegroundColor Yellow
    Write-Host "   1. Visit https://gbox.ai" -ForegroundColor White
    Write-Host "   2. Log in and find box: $BoxId" -ForegroundColor White
    Write-Host "   3. Look for 'ADB Connection' or 'Connect via ADB'" -ForegroundColor White
    Write-Host "   4. Copy the connection string (format: host:port)" -ForegroundColor White
    Write-Host ""
    $GboxEndpoint = Read-Host "Enter the gbox.ai ADB endpoint (host:port)"
}

if ([string]::IsNullOrEmpty($GboxEndpoint)) {
    Write-Host "❌ No endpoint provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔌 Connecting to: $GboxEndpoint" -ForegroundColor Cyan

# Disconnect any existing connections first
Write-Host "Disconnecting existing connections..." -ForegroundColor Gray
adb disconnect $GboxEndpoint 2>&1 | Out-Null

# Connect to gbox device
Write-Host "Connecting..." -ForegroundColor Gray
$connectResult = adb connect $GboxEndpoint 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful!" -ForegroundColor Green
    Write-Host $connectResult -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "📱 Checking connected devices..." -ForegroundColor Cyan
    adb devices
    
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Start Expo dev server: npm start" -ForegroundColor White
    Write-Host "   2. Press 'a' to open on Android device" -ForegroundColor White
    Write-Host "   3. Or run: npx expo start --android" -ForegroundColor White
} else {
    Write-Host "❌ Connection failed!" -ForegroundColor Red
    Write-Host $connectResult -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   - Verify the endpoint is correct" -ForegroundColor White
    Write-Host "   - Check if the box is running on gbox.ai" -ForegroundColor White
    Write-Host "   - Ensure your network can reach gbox.ai" -ForegroundColor White
    exit 1
}





