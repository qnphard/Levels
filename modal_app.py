import modal
import io
import time
import json
import numpy as np
import soundfile as sf

# Define the Modal Image (Docker container)
image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git", "libsndfile1")
    .pip_install(
        "torch",
        "torchaudio",
        "TTS",
        "scipy",
        "numpy",
        "coqui-tts"
    )
    # Download the model at build time to cache it
    .run_commands("python -c 'from TTS.api import TTS; TTS(\"tts_models/multilingual/multi-dataset/xtts_v2\")'")
)

app = modal.App("meditation-tts", image=image)

# Brainwave generation logic (Copied from previous research)
BRAINWAVES = {
    "none": 0,
    "delta": 2,
    "theta": 6,
    "alpha": 10,
    "beta": 18,
}

def generate_binaural_beat(duration, beat_freq, sample_rate=24000, base_freq=200, volume=0.15):
    if beat_freq <= 0:
        return None
    
    t = np.linspace(0, duration, int(sample_rate * duration), dtype=np.float32)
    left = np.sin(2 * np.pi * base_freq * t) * volume
    right = np.sin(2 * np.pi * (base_freq + beat_freq) * t) * volume
    return np.stack([left, right], axis=1)

@app.cls(gpu="T4", container_idle_timeout=300)
class Model:
    def __enter__(self):
        print("Loading XTTS Model...")
        from TTS.api import TTS
        self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cuda")
        print("Model Loaded on GPU")

    @modal.web_endpoint(method="POST")
    def synthesize(self, item: dict):
        text = item.get("text")
        speaker_wav_url = item.get("ref_audio_url") # Pass URL or base64
        # For simplicity, we might need to handle file uploads or just assume a standard sample is baked in 
        # or downloaded. For now, let's assume we pass a text and getting a basic response working.
        
        # To make this robust, we usually bake the voice sample into the image or download it.
        # Let's assume there's a reference audio file available or passed as base64.
        
        # NOTE: For this MVP, we will assume a fixed voice sample is downloaded or we use a standard one.
        # But to match previous cloning, we need the file.
        # Let's save a "voice_sample.mp3" to the image if possible, or accept it in the payload.
        # For bandwidth, sending 1MB audio every request is meh.
        # Let's assume we download a sample once.
        
        speed = item.get("speed", 1.0)
        brainwave = item.get("brainwave", "theta")
        binaural_vol = item.get("binaural_volume", 0.15)
        
        # Temporary: Use a fake file path if we can't upload easily yet.
        # Actually, XTTS needs a file path.
        # We can write base64 to /tmp/ref.wav
        
        ref_audio_path = "/tmp/ref_voice.wav"
        
        # If the user sends base64 audio (ideal)
        if "ref_audio_base64" in item:
            import base64
            with open(ref_audio_path, "wb") as f:
                f.write(base64.b64decode(item.get("ref_audio_base64")))
        else:
            # Fallback: Download a sample or use a default if available
            # For this script to work out of the box, we'll download a sample
            import urllib.request
            if not os.path.exists(ref_audio_path):
                 # Placeholder sample URL (replace with yours)
                 urllib.request.urlretrieve("https://huggingface.co/datasets/coqui/xtts-v2-samples/resolve/main/sample_1.wav", ref_audio_path)
        
        print(f"Synthesizing: {text[:20]}...")
        
        # Generate Audio
        output_wav = "/tmp/output.wav"
        self.tts.tts_to_file(
            text=text,
            file_path=output_wav,
            speaker_wav=ref_audio_path,
            language="en",
            speed=speed
        )
        
        # Mix Binaural
        data, sr = sf.read(output_wav)
        beat_freq = BRAINWAVES.get(brainwave, 0)
        
        if beat_freq > 0 and binaural_vol > 0:
             duration = len(data) / sr
             beat = generate_binaural_beat(duration, beat_freq, sample_rate=sr, volume=binaural_vol)
             if beat is not None:
                # Handle Mono/Stereo
                if len(data.shape) == 1:
                    data = np.stack([data, data], axis=1)
                
                # Resize beat
                if len(beat) != len(data):
                    # Simple resize/crop for safety
                    min_len = min(len(beat), len(data))
                    beat = beat[:min_len]
                    data = data[:min_len]

                data = data + beat
                # Normalize
                max_val = np.max(np.abs(data))
                if max_val > 1.0: data = data / max_val
                
                sf.write(output_wav, data, sr)

        # Return File Bytes
        with open(output_wav, "rb") as f:
            audio_content = f.read()
            
        return modal.Response(
            content=audio_content,
            headers={"Content-Type": "audio/wav"}
        )

