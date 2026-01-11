#!/usr/bin/env python3
"""Test COMFYUI connection and workflow format"""
import urllib.request
import json
import sys

COMFYUI_URL = "http://127.0.0.1:8188"

try:
    # Check if COMFYUI is running
    response = urllib.request.urlopen(f"{COMFYUI_URL}/object_info")
    data = json.loads(response.read())
    
    print("COMFYUI is running!")
    print(f"Available nodes: {len(data)}")
    
    # Check for AnimateDiff nodes
    animatediff_nodes = [k for k in data.keys() if 'animate' in k.lower() or 'ade' in k.lower() or 'motion' in k.lower()]
    if animatediff_nodes:
        print(f"\nAnimateDiff nodes found: {animatediff_nodes[:10]}")
    else:
        print("\n⚠️  No AnimateDiff nodes found. Extension may not be loaded.")
    
    # Check available models
    try:
        models_resp = urllib.request.urlopen(f"{COMFYUI_URL}/object_info")
        models_data = json.loads(models_resp.read())
        if 'CheckpointLoaderSimple' in models_data:
            checkpoint_info = models_data['CheckpointLoaderSimple']
            if 'input' in checkpoint_info and 'required' in checkpoint_info['input']:
                if 'ckpt_name' in checkpoint_info['input']['required']:
                    # Try to get available checkpoints
                    print("\nChecking for available checkpoints...")
    except:
        pass
    
    # Test simple workflow
    print("\nTesting workflow format...")
    test_workflow = {
        "1": {
            "inputs": {
                "ckpt_name": "v1-5-pruned-emaonly.safetensors"
            },
            "class_type": "CheckpointLoaderSimple"
        }
    }
    
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        json.dumps({"prompt": test_workflow}).encode()
    )
    req.add_header('Content-Type', 'application/json')
    
    try:
        resp = urllib.request.urlopen(req, timeout=5)
        result = json.loads(resp.read())
        print(f"✅ Workflow format OK! Response: {result}")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"[ERROR] Workflow error: {e.code}")
        print(f"Error details: {error_body[:500]}")
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        
except urllib.error.URLError:
    print("❌ COMFYUI is not running or not accessible")
    print(f"   Make sure COMFYUI is running at {COMFYUI_URL}")
except Exception as e:
    print(f"❌ Error: {e}")

