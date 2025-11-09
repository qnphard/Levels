# Quick Start Guide - Generate Animations

## Important: COMFYUI Location

The scripts are configured to use COMFYUI from:
```
C:\Users\Alin\Levels4 - Copy\ComfyUI
```

If COMFYUI is not in this location, you have two options:

### Option 1: Specify Custom Path
```powershell
.\scripts\start_comfyui.ps1 'C:\path\to\your\ComfyUI'
```

### Option 2: Find COMFYUI Automatically
```powershell
.\scripts\find_comfyui.ps1
```
This will search for COMFYUI installations and show you available paths.

## Step 1: Find COMFYUI (if needed)

If you're not sure where COMFYUI is installed:

```powershell
.\scripts\find_comfyui.ps1
```

This will search for COMFYUI installations and show you the path.

## Step 2: Start COMFYUI

**Option A: Use default path (Levels4 - Copy\ComfyUI)**
```powershell
.\scripts\start_comfyui.ps1
```

**Option B: Specify custom path**
```powershell
.\scripts\start_comfyui.ps1 'C:\path\to\ComfyUI'
```

Wait until you see "Starting server" message. Keep this terminal open.

## Step 3: Generate Animations

Open a **new terminal** and run:

```powershell
cd "C:\Users\Alin\Levels4 - Copy"
.\scripts\generate_all_animations.ps1
```

Or run the Python script directly:

```powershell
python scripts/generate_comfyui_animations.py
```

## What Happens

1. Script checks if COMFYUI is running
2. Generates all 17 animations sequentially
3. Saves MP4 files to `assets/animations/`
4. Shows progress for each animation

## Expected Output Directory

```
assets/animations/
├── desire-black-hole.mp4
├── power-vs-force.mp4
├── natural-happiness.mp4
├── energy-leak.mp4
├── knowledge-vs-practice.mp4
├── levels-of-truth.mp4
├── reprogramming-transition.mp4
├── resistance-flow.mp4
├── intention-ripple.mp4
├── music-vibration.mp4
├── spiritual-progress-spiral.mp4
├── addiction-cloud.mp4
├── reaction-vs-power.mp4
├── body-mind-spirit-layers.mp4
├── shadow-illumination.mp4
├── fear-grief-spill.mp4
└── emotional-stack-collapse.mp4
```

## Troubleshooting

### COMFYUI not found in Levels4 - Copy
- Run `.\scripts\find_comfyui.ps1` to locate it
- Or manually specify path: `.\scripts\start_comfyui.ps1 'C:\path\to\ComfyUI'`

### Connection refused
- Make sure COMFYUI is running (Step 2)
- Check if it's on a different port (default: 8188)
- Edit `COMFYUI_URL` in `scripts/generate_comfyui_animations.py` if needed

### Generation fails
- Check COMFYUI console for errors
- Verify AnimateDiff extension is installed
- Ensure required models are downloaded
- Update model names in `create_workflow()` function if needed

## Notes

- Generation takes 10-30 minutes per animation (depending on hardware)
- You can stop and restart - the script will continue from where it left off
- Test with one animation first before generating all
