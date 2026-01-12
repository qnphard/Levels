# ✅ COMFYUI Setup Complete!

COMFYUI has been successfully set up in:
```
C:\Users\Alin\Levels4 - Copy\ComfyUI
```

## What's Installed

✅ **COMFYUI Core** - Main installation  
✅ **Dependencies** - All required Python packages  
✅ **AnimateDiff Extension** - For generating animations  

## Next Steps

### 1. Download Models (Required)

You'll need to download models for COMFYUI to work:

**Base Checkpoint Model:**
- Download a Stable Diffusion model (e.g., `v1-5-pruned-emaonly.safetensors`)
- Place in: `ComfyUI\models\checkpoints\`

**AnimateDiff Motion Model:**
- Download from: https://huggingface.co/guoyww/animatediff-motion-adapter-v1-5-2
- Place in: `ComfyUI\models\animatediff_models\`

### 2. Start COMFYUI

```powershell
cd "C:\Users\Alin\Levels4 - Copy"
.\scripts\start_comfyui.ps1
```

Wait until you see "Starting server" message.

### 3. Generate Animations

In a new terminal:

```powershell
cd "C:\Users\Alin\Levels4 - Copy"
.\scripts\generate_all_animations.ps1
```

## Quick Test

To verify everything works:

1. Start COMFYUI: `.\scripts\start_comfyui.ps1`
2. Open browser: http://127.0.0.1:8188
3. You should see the COMFYUI interface

## Notes

- Models need to be downloaded separately (they're large files)
- First run will download additional dependencies automatically
- Generation takes 10-30 minutes per animation depending on hardware

## Troubleshooting

### Models Missing
- Check `ComfyUI\models\checkpoints\` for base model
- Check `ComfyUI\models\animatediff_models\` for motion model
- Download from HuggingFace or Civitai

### Port Already in Use
- Edit `main.py` or use: `python main.py --port 8189`
- Update `COMFYUI_URL` in generation script

### AnimateDiff Not Working
- Check `ComfyUI\custom_nodes\ComfyUI-AnimateDiff-Evolved\` exists
- Restart COMFYUI after installing extensions

