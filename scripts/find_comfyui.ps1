# Script to find COMFYUI installation on the system

Write-Host "Searching for COMFYUI installation..." -ForegroundColor Green
Write-Host ""

$searchPaths = @(
    "C:\Users\Alin\Levels4 - Copy",  # Check Levels4 folder first
    "C:\Users\Alin\Desktop",
    "C:\Users\Alin",
    "C:\",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE"
)

$found = @()

foreach ($basePath in $searchPaths) {
    if (Test-Path $basePath) {
        Write-Host "Searching in: $basePath" -ForegroundColor Cyan
        try {
            $results = Get-ChildItem -Path $basePath -Directory -Filter "*ComfyUI*" -Recurse -ErrorAction SilentlyContinue -Depth 3
            foreach ($result in $results) {
                $found += $result.FullName
                Write-Host "  Found: $($result.FullName)" -ForegroundColor Green
            }
        } catch {
            # Skip if access denied
        }
    }
}

Write-Host ""
if ($found.Count -eq 0) {
    Write-Host "[WARNING] No COMFYUI directories found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please manually specify your COMFYUI path:" -ForegroundColor Yellow
    Write-Host "  .\scripts\start_comfyui.ps1 'C:\path\to\ComfyUI'" -ForegroundColor Cyan
} else {
    Write-Host "[OK] Found $($found.Count) COMFYUI installation(s)" -ForegroundColor Green
    Write-Host ""
    Write-Host "To use one of these, run:" -ForegroundColor Yellow
    Write-Host "  .\scripts\start_comfyui.ps1 '$($found[0])'" -ForegroundColor Cyan
}

