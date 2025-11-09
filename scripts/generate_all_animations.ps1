# PowerShell script to generate all animations
# Make sure COMFYUI is running first (use start_comfyui.ps1)

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host "="*59 -ForegroundColor Cyan
Write-Host "COMFYUI Animation Generator for Levels4" -ForegroundColor Green
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host "="*59 -ForegroundColor Cyan
Write-Host ""

# Check if COMFYUI is running
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8188/system_stats" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "[OK] COMFYUI is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[ERROR] Cannot connect to COMFYUI at http://127.0.0.1:8188" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start COMFYUI first:" -ForegroundColor Yellow
    Write-Host "  1. Run: .\scripts\start_comfyui.ps1" -ForegroundColor Yellow
    Write-Host "  2. Wait for it to fully load" -ForegroundColor Yellow
    Write-Host "  3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Navigate to project directory
Set-Location "C:\Users\Alin\Levels4 - Copy"

# Run the Python script
Write-Host "Starting animation generation..." -ForegroundColor Green
Write-Host ""
python scripts/generate_comfyui_animations.py

