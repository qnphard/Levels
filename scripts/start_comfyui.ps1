# PowerShell script to start COMFYUI
# Run this before generating animations

# Default COMFYUI path (in Levels4 - Copy folder)
$ComfyUIPath = Join-Path $PSScriptRoot "..\ComfyUI"
# Resolve to absolute path
$ComfyUIPath = (Resolve-Path $ComfyUIPath -ErrorAction SilentlyContinue).Path
if (-not $ComfyUIPath) {
    $ComfyUIPath = "C:\Users\Alin\Levels4 - Copy\ComfyUI"
}

# Allow override via environment variable or parameter
if ($env:COMFYUI_PATH) {
    $ComfyUIPath = $env:COMFYUI_PATH
}
if ($args.Count -gt 0) {
    $ComfyUIPath = $args[0]
}

Write-Host "Starting COMFYUI..." -ForegroundColor Green
Write-Host "Location: $ComfyUIPath" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $ComfyUIPath)) {
    Write-Host "[ERROR] COMFYUI directory not found: $ComfyUIPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please specify the correct path:" -ForegroundColor Yellow
    Write-Host "  .\scripts\start_comfyui.ps1 'C:\path\to\ComfyUI'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or set environment variable:" -ForegroundColor Yellow
    Write-Host "  `$env:COMFYUI_PATH='C:\path\to\ComfyUI'" -ForegroundColor Yellow
    Write-Host "  .\scripts\start_comfyui.ps1" -ForegroundColor Yellow
    exit 1
}

Set-Location $ComfyUIPath

if (Test-Path "main.py") {
    Write-Host "[OK] Found main.py" -ForegroundColor Green
    Write-Host "Starting COMFYUI server..." -ForegroundColor Yellow
    Write-Host "Once you see 'Starting server', open another terminal to run the generation script" -ForegroundColor Yellow
    Write-Host ""
    python main.py
} else {
    Write-Host "[ERROR] main.py not found in: $ComfyUIPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Files in directory:" -ForegroundColor Yellow
    Get-ChildItem | Select-Object -First 10 Name
    Write-Host ""
    Write-Host "Please verify COMFYUI is installed correctly or specify the correct path" -ForegroundColor Red
}

