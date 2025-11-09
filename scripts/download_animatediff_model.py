#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Download AnimateDiff motion model
"""

import sys
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

from huggingface_hub import hf_hub_download, list_repo_files
import os

filename = "mm_sd_v15_v2.safetensors"

# Output directory
output_dir = os.path.join(os.path.dirname(__file__), "..", "ComfyUI", "models", "animatediff_models")
os.makedirs(output_dir, exist_ok=True)

print(f"Downloading AnimateDiff motion model...")
print(f"Output directory: {output_dir}")

# Try the first repository that worked
repo_id = "guoyww/animatediff-motion-adapter-v1-5-2"

try:
    print(f"\nListing files in {repo_id}...")
    files = list_repo_files(repo_id=repo_id, repo_type="model")
    print(f"Available files:")
    for f in files:
        print(f"  - {f}")
    
    # Look for motion model files - check all safetensors files
    safetensors_files = [f for f in files if f.endswith('.safetensors')]
    if safetensors_files:
        print(f"\nFound safetensors files: {safetensors_files}")
        # Use the first one or look for v15
        target_file = next((f for f in safetensors_files if 'v15' in f.lower() or 'v1-5' in f.lower()), safetensors_files[0])
        print(f"Downloading: {target_file}")
        
        downloaded_path = hf_hub_download(
            repo_id=repo_id,
            filename=target_file,
            local_dir=output_dir
        )
        print(f"[OK] Successfully downloaded to: {downloaded_path}")
        
        # Rename to expected filename if different
        final_path = os.path.join(output_dir, filename)
        if downloaded_path != final_path:
            import shutil
            if os.path.exists(downloaded_path):
                if os.path.exists(final_path):
                    os.remove(final_path)
                shutil.move(downloaded_path, final_path)
                print(f"[OK] Renamed to: {filename}")
        
        print(f"\n[OK] AnimateDiff motion model ready at: {final_path}")
    else:
        print("[ERROR] No safetensors files found in repository")
        print("\nPlease download manually from:")
        print(f"https://huggingface.co/{repo_id}/tree/main")
        sys.exit(1)
        
except Exception as e:
    print(f"[ERROR] Error: {e}")
    print("\nPlease download manually:")
    print("1. Visit: https://huggingface.co/guoyww/animatediff-motion-adapter-v1-5-2/tree/main")
    print("2. Download any motion adapter .safetensors file")
    print(f"3. Rename to '{filename}' and save to: {output_dir}")
    sys.exit(1)
