#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
COMFYUI Animation Generator Script
Generates all animations for Levels4 app using COMFYUI API

Requirements:
- COMFYUI running (default: http://127.0.0.1:8188)
- AnimateDiff extension installed
- Required models downloaded

Usage:
    python scripts/generate_comfyui_animations.py
"""

import json
import urllib.request
import urllib.parse
import time
import os
import sys
from typing import Dict, List, Optional

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# COMFYUI API endpoint
COMFYUI_URL = "http://127.0.0.1:8188"

# Animation configurations
ANIMATIONS = {
    "desire-black-hole": {
        "prompt": "A mesmerizing black hole in deep space, purple and dark blue accretion disk rotating around a dark center, particles spiraling inward in a vortex, glowing energy trails, cosmic dust, ethereal purple and blue light, smooth rotation, loop animation, spiritual and mystical atmosphere, high contrast, vibrant colors",
        "negative": "static image, still frame, low quality, blurry, pixelated, distorted, choppy animation",
        "frames": 120,
        "fps": 24,
        "width": 512,
        "height": 512,
    },
    "power-vs-force": {
        "prompt": "Two contrasting energy flows side by side: left side shows chaotic red force energy pushing against a wall, particles bouncing and scattering, exhausting movement. Right side shows smooth blue power energy flowing effortlessly like water, gentle waves, harmonious motion, peaceful and effortless, smooth transitions, loop animation",
        "negative": "static, still, low quality, blurry, choppy animation, abrupt transitions",
        "frames": 90,
        "fps": 24,
        "width": 512,
        "height": 256,
    },
    "natural-happiness": {
        "prompt": "A beautiful sky scene with fluffy white clouds drifting slowly, bright sun shining through, warm golden light, peaceful blue sky, clouds moving gently, sun pulsing softly with warm glow, serene and calming atmosphere, smooth cloud movement, loop animation, spiritual and peaceful",
        "negative": "dark, stormy, chaotic, low quality, blurry, static, harsh lighting",
        "frames": 100,
        "fps": 24,
        "width": 512,
        "height": 384,
    },
    "energy-leak": {
        "prompt": "Energy flowing upward like a fountain, blocked by gray emotional barriers, energy leaking out in curved streams, glowing green energy particles escaping, barriers dissolving when energy flows through, smooth particle trails, loop animation, spiritual energy visualization",
        "negative": "static, choppy, low quality, blurry, pixelated, straight lines",
        "frames": 110,
        "fps": 24,
        "width": 512,
        "height": 512,
    },
    "knowledge-vs-practice": {
        "prompt": "Left side: static books stacked, knowledge represented as still books. Right side: dynamic circle pulsing with energy, ripples expanding outward, particles radiating, active and alive, smooth pulsing motion, loop animation, contrasting static vs dynamic",
        "negative": "static, still, low quality, blurry, choppy, synchronized movement",
        "frames": 80,
        "fps": 24,
        "width": 512,
        "height": 256,
    },
    "levels-of-truth": {
        "prompt": "Four independent glowing circles arranged in space, each pulsing at different rhythms, connected by subtle energy lines, purple and blue glowing orbs, each representing a different level of truth, smooth pulsing animations, independent but connected, loop animation, spiritual and mystical",
        "negative": "static, synchronized, low quality, blurry, uniform pulsing",
        "frames": 100,
        "fps": 24,
        "width": 512,
        "height": 512,
    },
    "reprogramming-transition": {
        "prompt": "Old programming represented as fading gray box shrinking, new programming as glowing purple box growing and expanding, particles transitioning between them, smooth morphing transition, transformation animation, loop animation, spiritual reprogramming visualization",
        "negative": "static, abrupt transition, low quality, blurry, choppy morphing",
        "frames": 90,
        "fps": 24,
        "width": 512,
        "height": 256,
    },
    "resistance-flow": {
        "prompt": "Two energy bars side by side: left shows red resistance block pushing against wall with squash and stretch, exhausting movement. Right shows blue flow block moving smoothly, glowing with energy, effortless motion, smooth transitions, loop animation, contrasting resistance vs flow",
        "negative": "static, choppy, low quality, blurry, rigid movement",
        "frames": 85,
        "fps": 24,
        "width": 512,
        "height": 256,
    },
    "intention-ripple": {
        "prompt": "Center point pulsing with purple glow, expanding ripple waves radiating outward, awareness indicators appearing around the ripples, smooth expanding circles, glowing particles, spiritual intention visualization, loop animation, peaceful and focused",
        "negative": "static, choppy, low quality, blurry, chaotic ripples",
        "frames": 95,
        "fps": 24,
        "width": 512,
        "height": 512,
    },
    "music-vibration": {
        "prompt": "Two sets of audio waves: left side shows chaotic red high-frequency waves, irregular and jarring. Right side shows smooth blue harmonious waves, flowing and peaceful, contrasting anger-based vs classical music, smooth wave animations, loop animation",
        "negative": "static, still, low quality, blurry, synchronized waves",
        "frames": 100,
        "fps": 24,
        "width": 512,
        "height": 256,
    },
    "spiritual-progress-spiral": {
        "prompt": "Spiral path traced through space, glowing dot moving along the spiral with vertical oscillation showing ups and downs, purple energy trail, non-linear spiritual progress visualization, smooth spiral motion, loop animation, mystical and spiritual",
        "negative": "linear, straight, static, low quality, blurry, uniform motion",
        "frames": 120,
        "fps": 24,
        "width": 512,
        "height": 512,
    },
    "addiction-cloud": {
        "prompt": "Sky scene with sun always shining, clouds appearing and disappearing, drug effect temporarily clears clouds, withdrawal brings thicker clouds back, sun pulsing gently, smooth cloud transitions, loop animation, spiritual metaphor for addiction",
        "negative": "static, choppy, low quality, blurry, harsh transitions",
        "frames": 110,
        "fps": 24,
        "width": 512,
        "height": 384,
    },
    "reaction-vs-power": {
        "prompt": "Two circles: left shows red reaction circle bouncing when triggered, losing power and fading. Right shows blue power circle stable and radiating energy outward, maintaining power, smooth animations, loop animation, contrasting reaction vs power",
        "negative": "static, choppy, low quality, blurry, synchronized movement",
        "frames": 90,
        "fps": 24,
        "width": 512,
        "height": 256,
    },
    "body-mind-spirit-layers": {
        "prompt": "Three horizontal layers stacked: body layer (red tension transitioning to green relaxation), mind layer (red tension to green relaxation), spirit layer (red tension to green relaxation), letting go indicator appearing, smooth layer-by-layer relaxation, loop animation, spiritual healing visualization",
        "negative": "static, choppy, low quality, blurry, abrupt transitions",
        "frames": 100,
        "fps": 24,
        "width": 512,
        "height": 384,
    },
    "shadow-illumination": {
        "prompt": "Dark shadow circle in center, acknowledgment indicator appears, then golden light expands and illuminates the shadow, shadow shrinks and fades as light grows, smooth illumination transition, loop animation, spiritual shadow work visualization",
        "negative": "static, abrupt, low quality, blurry, harsh lighting",
        "frames": 95,
        "fps": 24,
        "width": 512,
        "height": 512,
    },
    "fear-grief-spill": {
        "prompt": "Container filling with accumulated fear/grief energy (red/orange), energy spilling out into life experiences, spill effect flowing, life experience indicators appearing, smooth filling and spilling animation, loop animation, spiritual emotional processing",
        "negative": "static, choppy, low quality, blurry, abrupt flow",
        "frames": 105,
        "fps": 24,
        "width": 512,
        "height": 384,
    },
    "emotional-stack-collapse": {
        "prompt": "Stack of emotional layers collapsing from bottom up, energy release from bottom, layers dissolving as they collapse, smooth collapse animation, loop animation, spiritual emotional release visualization",
        "negative": "static, choppy, low quality, blurry, abrupt collapse",
        "frames": 100,
        "fps": 24,
        "width": 512,
        "height": 384,
    },
}


def queue_prompt(prompt: Dict) -> str:
    """Queue a prompt in COMFYUI and return the prompt ID"""
    p = {"prompt": prompt}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"{COMFYUI_URL}/prompt", data=data)
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read())
            return result['prompt_id']
    except Exception as e:
        print(f"Error queueing prompt: {e}")
        raise


def get_history(prompt_id: str) -> Optional[Dict]:
    """Get the history for a prompt ID"""
    try:
        with urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}") as response:
            return json.loads(response.read())
    except Exception as e:
        print(f"Error getting history: {e}")
        return None


def get_image(filename: str, subfolder: str, folder_type: str) -> bytes:
    """Get an image from COMFYUI output"""
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    try:
        with urllib.request.urlopen(f"{COMFYUI_URL}/view?{url_values}") as response:
            return response.read()
    except Exception as e:
        print(f"Error getting image: {e}")
        raise


def create_workflow(animation_name: str, config: Dict) -> Dict:
    """Create a COMFYUI workflow for the animation using AnimateDiff Evolved"""
    
    # Use the base workflow structure from the JSON file
    # Load base workflow and modify it
    base_workflow_path = os.path.join(os.path.dirname(__file__), "..", "comfyui_workflows", "base_animation_workflow.json")
    
    try:
        with open(base_workflow_path, 'r') as f:
            workflow_data = json.load(f)
    except FileNotFoundError:
        # Fallback to programmatic workflow creation
        workflow_data = {
            "last_node_id": 9,
            "last_link_id": 10,
            "nodes": [],
            "links": [],
            "groups": [],
            "config": {},
            "extra": {},
            "version": 0.4
        }
    
    # Convert workflow format to API format (node dictionary)
    # COMFYUI API expects: {"prompt": {node_id: {inputs, class_type}}}
    workflow = {}
    
    # Node 1: CLIP Text Encode (Prompt)
    workflow["1"] = {
        "inputs": {
            "text": f"{config['prompt']}, seamless loop, first frame equals last frame",
            "clip": ["3", 1]
        },
        "class_type": "CLIPTextEncode"
    }
    
    # Node 2: CLIP Text Encode (Negative)
    workflow["2"] = {
        "inputs": {
            "text": config.get('negative', 'static image, still frame, low quality, blurry, pixelated, distorted'),
            "clip": ["3", 1]
        },
        "class_type": "CLIPTextEncode"
    }
    
    # Node 3: Checkpoint Loader
    workflow["3"] = {
        "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly.safetensors"  # Adjust to your model
        },
        "class_type": "CheckpointLoaderSimple"
    }
    
    # Node 4: Load AnimateDiff Model
    workflow["4"] = {
        "inputs": {
            "model_name": "mm_sd_v15_v2.ckpt",
            "beta_schedule": "autoselect"
        },
        "class_type": "ADE_LoadAnimateDiffModel"
    }
    
    # Node 5: Apply AnimateDiff Model to base model
    workflow["5"] = {
        "inputs": {
            "model": ["3", 0],  # Base model from checkpoint
            "motion_model": ["4", 0]  # Motion model from loader
        },
        "class_type": "ADE_ApplyAnimateDiffModel"
    }
    
    # Node 6: KSampler
    workflow["6"] = {
        "inputs": {
            "seed": 12345,
            "steps": 20,
            "cfg": 7.0,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
            "model": ["5", 0],  # Animated model from ApplyAnimateDiffModel
            "positive": ["1", 0],
            "negative": ["2", 0],
            "latent_image": ["7", 0]
        },
        "class_type": "KSampler"
    }
    
    # Node 7: Empty Latent Image
    workflow["7"] = {
        "inputs": {
            "width": config['width'],
            "height": config['height'],
            "batch_size": config['frames']
        },
        "class_type": "EmptyLatentImage"
    }
    
    # Node 8: VAE Decode
    workflow["8"] = {
        "inputs": {
            "samples": ["6", 0],
            "vae": ["3", 2]
        },
        "class_type": "VAEDecode"
    }
    
    # Node 9: Save Image (required output node)
    workflow["9"] = {
        "inputs": {
            "filename_prefix": animation_name,
            "images": ["8", 0]
        },
        "class_type": "SaveImage"
    }
    
    return workflow


def wait_for_completion(prompt_id: str, timeout: int = 600) -> bool:
    """Wait for a prompt to complete"""
    start_time = time.time()
    while time.time() - start_time < timeout:
        history = get_history(prompt_id)
        if history and prompt_id in history:
            return True
        time.sleep(1)
    return False


def generate_animation(animation_name: str, config: Dict, output_dir: str = "assets/animations"):
    """Generate a single animation"""
    print(f"\n{'='*60}")
    print(f"Generating: {animation_name}")
    print(f"{'='*60}")
    print(f"Frames: {config['frames']}, Size: {config['width']}x{config['height']}")
    print(f"Prompt: {config['prompt'][:100]}...")
    
    # Create workflow
    workflow = create_workflow(animation_name, config)
    
    # Queue prompt - COMFYUI expects {"prompt": workflow}
    try:
        prompt_data = {"prompt": workflow}
        result = queue_prompt(prompt_data)
        prompt_id = result.get('prompt_id') if isinstance(result, dict) else None
        if not prompt_id:
            print(f"[ERROR] No prompt_id returned. Response: {result}")
            return False
        print(f"Queued with ID: {prompt_id}")
        
        # Wait for completion
        print("Waiting for generation to complete...")
        if wait_for_completion(prompt_id, timeout=1800):  # 30 min timeout
            print(f"[OK] Generation complete for {animation_name}")
            
            # Get output files
            history = get_history(prompt_id)
            if history and prompt_id in history:
                outputs = history[prompt_id]['outputs']
                # Process outputs and save video
                # Note: You'll need to convert images to video using ffmpeg or similar
                print(f"[OK] Outputs available for {animation_name}")
                return True
        else:
            print(f"[ERROR] Timeout waiting for {animation_name}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error generating {animation_name}: {e}")
        return False


def convert_images_to_video(image_dir: str, output_path: str, fps: int = 24):
    """Convert image sequence to MP4 video using ffmpeg"""
    import subprocess
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Use ffmpeg to create video from images
    cmd = [
        "ffmpeg",
        "-y",  # Overwrite output file
        "-framerate", str(fps),
        "-i", f"{image_dir}/%05d.png",  # Input pattern
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "23",  # Quality (lower = better, 18-28 is good range)
        "-preset", "medium",
        "-loop", "1",  # Loop once for seamless playback
        output_path
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✓ Video created: {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Error creating video: {e}")
        print(f"  stdout: {e.stdout.decode()}")
        print(f"  stderr: {e.stderr.decode()}")
        return False
    except FileNotFoundError:
        print("✗ ffmpeg not found. Please install ffmpeg to convert images to video.")
        return False


def main():
    """Main function to generate all animations"""
    print("="*60)
    print("COMFYUI Animation Generator for Levels4")
    print("="*60)
    print(f"COMFYUI URL: {COMFYUI_URL}")
    print(f"Total animations: {len(ANIMATIONS)}")
    
    # Check if COMFYUI is running
    try:
        urllib.request.urlopen(f"{COMFYUI_URL}/system_stats", timeout=5)
        print("[OK] COMFYUI is running")
    except Exception as e:
        print(f"[ERROR] Cannot connect to COMFYUI at {COMFYUI_URL}")
        print("  Please ensure COMFYUI is running:")
        print("  1. Start COMFYUI: python main.py")
        print("  2. Wait for it to fully load")
        print("  3. Run this script again")
        print(f"\n  If COMFYUI is on a different port, edit COMFYUI_URL in the script")
        sys.exit(1)
    
    # Create output directory
    output_dir = "assets/animations"
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate each animation
    results = {}
    for animation_name, config in ANIMATIONS.items():
        success = generate_animation(animation_name, config, output_dir)
        results[animation_name] = success
        
        # Small delay between animations
        if success:
            time.sleep(2)
    
    # Summary
    print("\n" + "="*60)
    print("Generation Summary")
    print("="*60)
    successful = sum(1 for v in results.values() if v)
    failed = len(results) - successful
    
    print(f"Successful: {successful}/{len(ANIMATIONS)}")
    print(f"Failed: {failed}/{len(ANIMATIONS)}")
    
    if failed > 0:
        print("\nFailed animations:")
        for name, success in results.items():
            if not success:
                print(f"  - {name}")
    
    print(f"\nOutput directory: {output_dir}")
    print("Note: You may need to convert image sequences to MP4 using ffmpeg")


if __name__ == "__main__":
    main()

