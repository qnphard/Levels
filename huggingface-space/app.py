"""
Piper TTS API - Hugging Face Space
Provides high-quality offline TTS using Piper VITS voices.
"""

import gradio as gr
import subprocess
import tempfile
import os
import urllib.request
import shutil

# Voice model configuration
VOICE_MODELS = {
    "amy": {
        "url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx",
        "config_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx.json",
        "name": "Amy (US Female)",
    },
    "lessac": {
        "url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx",
        "config_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json",
        "name": "Lessac (US Female)",
    },
    "ryan": {
        "url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/medium/en_US-ryan-medium.onnx",
        "config_url": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/ryan/medium/en_US-ryan-medium.onnx.json",
        "name": "Ryan (US Male)",
    },
}

MODEL_DIR = "/tmp/piper_models"

def download_model(voice_id: str):
    """Download voice model if not already present."""
    if voice_id not in VOICE_MODELS:
        raise ValueError(f"Unknown voice: {voice_id}")
    
    voice = VOICE_MODELS[voice_id]
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    model_path = os.path.join(MODEL_DIR, f"{voice_id}.onnx")
    config_path = os.path.join(MODEL_DIR, f"{voice_id}.onnx.json")
    
    if not os.path.exists(model_path):
        print(f"Downloading {voice_id} model...")
        urllib.request.urlretrieve(voice["url"], model_path)
        urllib.request.urlretrieve(voice["config_url"], config_path)
        print(f"Downloaded {voice_id}")
    
    return model_path, config_path

def synthesize(text: str, voice: str = "amy", speed: float = 0.85):
    """
    Synthesize speech from text.
    
    Args:
        text: The text to speak
        voice: Voice ID (amy, lessac, ryan)
        speed: Speech rate (0.5 = slow, 1.0 = normal, 1.5 = fast)
    
    Returns:
        Path to generated WAV file
    """
    if not text.strip():
        return None
    
    try:
        model_path, config_path = download_model(voice)
    except Exception as e:
        return f"Error downloading model: {e}"
    
    # Create temp file for output
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        output_path = f.name
    
    # Run piper
    try:
        cmd = [
            "piper",
            "--model", model_path,
            "--config", config_path,
            "--output_file", output_path,
            "--length-scale", str(1.0 / speed),  # Inverse for piper
        ]
        
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        
        stdout, stderr = process.communicate(input=text.encode("utf-8"))
        
        if process.returncode != 0:
            return f"Piper error: {stderr.decode()}"
        
        return output_path
        
    except Exception as e:
        return f"Synthesis error: {e}"

# Gradio interface
with gr.Blocks(title="Piper TTS API") as demo:
    gr.Markdown("# 🎙️ Piper TTS API")
    gr.Markdown("High-quality text-to-speech for meditation apps")
    
    with gr.Row():
        with gr.Column():
            text_input = gr.Textbox(
                label="Text to speak",
                placeholder="Enter your meditation script here...",
                lines=5,
            )
            voice_dropdown = gr.Dropdown(
                choices=[(v["name"], k) for k, v in VOICE_MODELS.items()],
                value="amy",
                label="Voice",
            )
            speed_slider = gr.Slider(
                minimum=0.5,
                maximum=1.2,
                value=0.85,
                step=0.05,
                label="Speed (lower = slower, calmer)",
            )
            generate_btn = gr.Button("Generate Speech", variant="primary")
        
        with gr.Column():
            audio_output = gr.Audio(label="Generated Audio", type="filepath")
    
    generate_btn.click(
        fn=synthesize,
        inputs=[text_input, voice_dropdown, speed_slider],
        outputs=audio_output,
    )
    
    gr.Markdown("""
    ### API Usage
    ```python
    from gradio_client import Client
    
    client = Client("YOUR_SPACE_URL")
    result = client.predict(
        text="Your meditation text here...",
        voice="amy",
        speed=0.85,
        api_name="/synthesize"
    )
    # result is the path to the generated WAV file
    ```
    """)

if __name__ == "__main__":
    demo.launch()
