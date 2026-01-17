import modal
import os

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
        "coqui-tts",
        "soundfile"
    )
    # Download the model at build time to cache it
    .run_commands("python -c 'from TTS.api import TTS; TTS(\"tts_models/multilingual/multi-dataset/xtts_v2\")'")
)

app = modal.App("meditation-tts", image=image)

# Brainwave presets
BRAINWAVES = {
    "none": 0,
    "delta": 2,
    "theta": 6,
    "alpha": 10,
    "beta": 18,
}

def generate_binaural_beat(duration, beat_freq, sample_rate=24000, base_freq=200, volume=0.15):
    import numpy as np
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
        import numpy as np
        import soundfile as sf
        import io
        import base64
        import urllib.request

        text = item.get("text")
        speed = item.get("speed", 1.0)
        brainwave = item.get("brainwave", "theta")
        binaural_vol = item.get("binaural_volume", 0.15)
        
        ref_audio_path = "/tmp/ref_voice.wav"
        
        # If the user sends base64 audio (optional)
        if "ref_audio_base64" in item:
            with open(ref_audio_path, "wb") as f:
                f.write(base64.b64decode(item.get("ref_audio_base64")))
        elif not os.path.exists(ref_audio_path):
            # Fallback: Download a high-quality meditation-friendly sample
            print("Downloading default reference audio...")
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
