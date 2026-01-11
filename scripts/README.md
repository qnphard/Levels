# COMFYUI Animation Generation Scripts

This directory contains scripts to automatically generate animations using COMFYUI.

## Prerequisites

1. **COMFYUI installed and running**
   - Default URL: `http://127.0.0.1:8188`
   - AnimateDiff extension installed
   - Required models downloaded

2. **ffmpeg** (for video conversion)
   - macOS: `brew install ffmpeg`
   - Ubuntu/Debian: `sudo apt-get install ffmpeg`
   - Windows: Download from https://ffmpeg.org/download.html

## Usage

### Basic Usage

```bash
# Start COMFYUI first
# Then run the generation script
python scripts/generate_comfyui_animations.py
```

### Configuration

Edit `generate_comfyui_animations.py` to customize:
- `COMFYUI_URL`: Change if COMFYUI is running on different port/host
- Model names: Update checkpoint and AnimateDiff model names
- Animation settings: Modify prompts, frames, dimensions in `ANIMATIONS` dict

## How It Works

1. **Connects to COMFYUI API** at the specified URL
2. **Creates workflows** for each animation with proper prompts
3. **Queues prompts** and waits for completion
4. **Downloads outputs** (image sequences)
5. **Converts to MP4** using ffmpeg (if available)

## Output

Generated MP4 files will be saved to:
```
assets/animations/{animation-name}.mp4
```

## Troubleshooting

### COMFYUI not responding
- Ensure COMFYUI is running: `python main.py`
- Check the URL/port matches your setup
- Verify API is enabled

### Models not found
- Update model names in `create_workflow()` function
- Ensure AnimateDiff models are in correct directory
- Check checkpoint model name matches your setup

### Video conversion fails
- Install ffmpeg (see Prerequisites)
- Check image sequence output directory
- Verify ffmpeg is in PATH

### Workflow errors
- Adapt `create_workflow()` to match your COMFYUI setup
- Check node types match your installed extensions
- Verify AnimateDiff is properly configured

## Customization

### Adding New Animations

Add to `ANIMATIONS` dict in `generate_comfyui_animations.py`:

```python
"new-animation": {
    "prompt": "Your prompt here",
    "negative": "Negative prompt",
    "frames": 100,
    "fps": 24,
    "width": 512,
    "height": 512,
}
```

### Changing Workflow Structure

Modify `create_workflow()` function to match your COMFYUI node setup. You can:
- Export your workflow from COMFYUI UI
- Convert to Python dict format
- Use that structure in the script

## Notes

- Generation can take 10-30 minutes per animation depending on hardware
- Ensure seamless loops by making first frame = last frame
- Test with one animation first before generating all
- Monitor COMFYUI console for errors

