# Binaural Beats Generation Script - V4 (FINAL)
# Background: 15%, Binaural: 40%, Plus 30s outro of binaural+background only

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$audioDir = "C:\Users\Admin\.gemini\antigravity\scratch\Levels\src\assets\audio_originals"
$sourceDir = "C:\Users\Admin\.gemini\antigravity\scratch\Levels\Guided meditations"
$tempDir = "C:\Users\Admin\.gemini\antigravity\scratch\Levels\temp_audio"
$outputDir = "C:\Users\Admin\.gemini\antigravity\scratch\Levels\src\assets\audio"

# Create temp directory
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Track configurations
$tracks = @(
    @{name = "breath_awareness"; bg = "pink"; beat = 8; carrier = 220 },
    @{name = "body_scan"; bg = "brown"; beat = 7; carrier = 210 },
    @{name = "safe_space"; bg = "wind"; beat = 8.5; carrier = 220 },
    @{name = "reset_after_overwhelm"; bg = "brown"; beat = 5.5; carrier = 200 },
    @{name = "releasing_tension"; bg = "brown"; beat = 6; carrier = 200 },
    @{name = "letting_thoughts_pass"; bg = "pink"; beat = 9; carrier = 220 },
    @{name = "softening_practice"; bg = "wind"; beat = 6.5; carrier = 210 },
    @{name = "meeting_resistance"; bg = "brown"; beat = 5; carrier = 200 },
    @{name = "staying_with_discomfort"; bg = "pink"; beat = 7.5; carrier = 210 },
    @{name = "gratitude_meditation"; bg = "rain"; beat = 9.5; carrier = 230 },
    @{name = "loving_kindness"; bg = "wind"; beat = 7.5; carrier = 220 },
    @{name = "stillness_practice"; bg = "wind"; beat = 8; carrier = 220 },
    @{name = "morning_centering"; bg = "pink"; beat = 10; carrier = 240 },
    @{name = "between_tasks"; bg = "pink"; beat = 9; carrier = 220 },
    @{name = "returning_to_daily_life"; bg = "wind"; beat = 10; carrier = 240 },
    @{name = "evening_wind_down"; bg = "rain"; beat = 5; carrier = 210 },
    @{name = "sleep_body_scan"; bg = "brown"; beat = 3.5; carrier = 200 },
    @{name = "middle_of_the_night"; bg = "brown"; beat = 2.5; carrier = 200 },
    @{name = "rest_without_sleep"; bg = "pink"; beat = 4; carrier = 210 },
    @{name = "deep_rest"; bg = "brown"; beat = 2; carrier = 200 }
)

# V4 FINAL VOLUMES
$bgVol = 0.15   # Background at 15%
$binVol = 0.40  # Binaural at 40%
$outroDuration = 30  # 30 seconds of binaural+background only at the end

foreach ($track in $tracks) {
    $voiceFile = "$audioDir\$($track.name).mp3"
    
    if (-not (Test-Path $voiceFile)) {
        Write-Host "SKIP: $($track.name) - voice file not found" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Processing: $($track.name)" -ForegroundColor Green
    Write-Host "Background: $($track.bg), Beat: $($track.beat)Hz, Carrier: $($track.carrier)Hz"
    
    # Get voice duration
    $durationOutput = & ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $voiceFile 2>&1
    $voiceDuration = [math]::Ceiling([double]$durationOutput)
    $totalDuration = $voiceDuration + $outroDuration
    Write-Host "Voice: ${voiceDuration}s + Outro: ${outroDuration}s = Total: ${totalDuration}s"
    
    $bgFile = "$tempDir\bg_$($track.name).wav"
    $binFile = "$tempDir\bin_$($track.name).wav"
    $voicePadFile = "$tempDir\voice_pad_$($track.name).wav"
    $outputFile = "$outputDir\$($track.name).mp3"
    
    # Generate background (full duration including outro)
    switch ($track.bg) {
        "pink" {
            Write-Host "Generating pink noise (${totalDuration}s)..."
            & ffmpeg -y -f lavfi -i "anoisesrc=color=pink:duration=$totalDuration" -ar 44100 $bgFile 2>&1 | Out-Null
        }
        "brown" {
            Write-Host "Generating brown noise (${totalDuration}s)..."
            & ffmpeg -y -f lavfi -i "anoisesrc=color=brown:duration=$totalDuration" -ar 44100 $bgFile 2>&1 | Out-Null
        }
        "rain" {
            Write-Host "Looping rain (${totalDuration}s)..."
            & ffmpeg -y -stream_loop -1 -i "$sourceDir\calmingrain.mp3" -t $totalDuration -ar 44100 $bgFile 2>&1 | Out-Null
        }
        "wind" {
            Write-Host "Looping wind (${totalDuration}s)..."
            & ffmpeg -y -stream_loop -1 -i "$sourceDir\blizzardwind.mp3" -t $totalDuration -ar 44100 $bgFile 2>&1 | Out-Null
        }
    }
    
    # Generate binaural beat (full duration including outro)
    $leftHz = $track.carrier
    $rightHz = $track.carrier + $track.beat
    Write-Host "Generating binaural: L=${leftHz}Hz, R=${rightHz}Hz (${totalDuration}s)..."
    & ffmpeg -y -f lavfi -i "sine=frequency=${leftHz}:duration=$totalDuration" -f lavfi -i "sine=frequency=${rightHz}:duration=$totalDuration" -filter_complex "[0][1]amerge=inputs=2,pan=stereo|c0=c0|c1=c1" -ar 44100 $binFile 2>&1 | Out-Null
    
    # Pad voice with silence for the outro duration
    Write-Host "Padding voice with ${outroDuration}s silence..."
    & ffmpeg -y -i $voiceFile -af "apad=pad_dur=$outroDuration" -ar 44100 $voicePadFile 2>&1 | Out-Null
    
    # Mix: padded voice + background + binaural
    Write-Host "Mixing (BG: $bgVol, Bin: $binVol)..."
    & ffmpeg -y -i $voicePadFile -i $bgFile -i $binFile -filter_complex "[1:a]volume=$bgVol[bg];[2:a]volume=$binVol[bin];[0:a][bg][bin]amix=inputs=3:duration=longest:dropout_transition=2" -b:a 192k $outputFile 2>&1 | Out-Null
    
    if (Test-Path $outputFile) {
        $fileSize = [math]::Round((Get-Item $outputFile).Length / 1MB, 1)
        Write-Host "SUCCESS: $($track.name).mp3 (${fileSize}MB)" -ForegroundColor Green
    }
    else {
        Write-Host "FAILED: $($track.name)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "V4 Processing complete!" -ForegroundColor Green
Write-Host "Background: 15%, Binaural: 40%, Outro: 30s"
Write-Host "Output directory: $outputDir"
