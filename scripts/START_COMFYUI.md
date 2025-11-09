# Starting COMFYUI for Animation Generation

Before running the animation generation script, you need to start COMFYUI.

## Quick Start

1. **Navigate to your COMFYUI directory**
   ```powershell
   cd "C:\Users\Alin\Desktop\swarm\ComfyUI"
   ```

2. **Start COMFYUI**
   ```bash
   python main.py
   ```

3. **Wait for it to load**
   - You should see "Starting server" message
   - Wait until you see "To see the GUI go to: http://127.0.0.1:8188"
   - The web interface should be accessible

4. **Run the generation script** (in a new terminal)
   ```bash
   cd "C:\Users\Alin\Levels4 - Copy"
   python scripts/generate_comfyui_animations.py
   ```

## Default Settings

- **URL**: `http://127.0.0.1:8188`
- **Port**: 8188 (default COMFYUI port)

If your COMFYUI is running on a different port, edit `COMFYUI_URL` in `scripts/generate_comfyui_animations.py`.

## Verifying COMFYUI is Running

You can check if COMFYUI is running by:
1. Opening http://127.0.0.1:8188 in your browser
2. Or running: `curl http://127.0.0.1:8188/system_stats`

## Troubleshooting

### Port Already in Use
If port 8188 is already in use:
```bash
python main.py --port 8189
```
Then update `COMFYUI_URL` in the script to match.

### AnimateDiff Not Found
Make sure AnimateDiff extension is installed:
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/Kosinkadink/ComfyUI-AnimateDiff-Evolved.git
```

### Models Missing
Ensure you have:
- Base checkpoint model (e.g., `v1-5-pruned-emaonly.safetensors`)
- AnimateDiff motion model (e.g., `mm_sd_v15_v2.safetensors`)

Update model names in `create_workflow()` function if needed.

