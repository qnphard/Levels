import modal
import os

# MeloTTS Image with all dependencies
image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git", "libsndfile1", "ffmpeg", "build-essential", "mecab", "libmecab-dev", "mecab-ipadic-utf8")

    .pip_install(
        "torch",
        "torchaudio",
        "numpy",
        "scipy",
        "soundfile",
        "fastapi",
        "pydub",
        "nltk",
        "librosa",
        "unidecode",
        "pypinyin",
        "inflect",
        "transformers",
        "mecab-python3",
        "unidic-lite",  # Lightweight unidic dictionary
        "rvc-python",   # ADDED: RVC Voice Conversion
    )
    # Install MeloTTS from GitHub
    .run_commands(
        "git clone https://github.com/myshell-ai/MeloTTS.git /root/MeloTTS",
        "cd /root/MeloTTS && pip install -e .",
        "python -m unidecode.util download",
        "mkdir -p /root/models"  # Create dir for RVC models
    )
    # Download NLTK data
    .run_commands(
        "python -c \"import nltk; nltk.download('averaged_perceptron_tagger_eng')\""
    )
    # Pre-download the model to cache it in the image
    .run_commands(
        "python -c 'from melo.api import TTS; TTS(language=\"EN\")'"
    )
)

app = modal.App("meditation-tts-rvc", image=image)

BRAINWAVES = {
    "none": 0,
    "delta": 2,
    "theta": 6,
    "alpha": 10,
    "beta": 18,
}

@app.cls(gpu="T4", scaledown_window=300, timeout=600, secrets=[modal.Secret.from_name("huggingface-secret")])
class Model:
    @modal.enter()
    def load_model(self):
        import torch
        from melo.api import TTS
        from rvc_python.infer import RVCInference
        import os
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading MeloTTS on {self.device}...")
        
        # Load MeloTTS English model
        self.tts = TTS(language='EN', device=self.device)
        self.speaker_ids = self.tts.hps.data.spk2id
        print(f"MeloTTS loaded. Speakers: {list(self.speaker_ids.keys())}")

        # Initialize RVC
        self.rvc_enabled = False
        self.rvc = None
        
        # Check for RVC model (You typically download this on startup if not baked in image)
        # For now, we'll look for it in /root/models or try to download if URL is env var
        self.rvc_model_path = "/root/models/meditation_voice.pth"
        
        # Logic to download model if ENV provided (requires HF_TOKEN in secrets)
        hf_token = os.environ.get("HF_TOKEN")
        model_url = os.environ.get("RVC_MODEL_URL")
        
        if model_url and hf_token:
            print(f"Downloading RVC model from {model_url}...")
            # Ideally use huggingface_hub or wget with auth header
            # Placeholder for future implementation once user provides URL
            pass 
            
        if os.path.exists(self.rvc_model_path):
            print("RVC Model found! Initializing...")
            self.rvc = RVCInference(device=self.device)
            self.rvc.load_model(self.rvc_model_path)
            self.rvc_enabled = True
        else:
            print("No RVC model found in /root/models. Voice conversion disabled.")

    @modal.fastapi_endpoint(method="POST")
    def synthesize(self, item: dict):
        from fastapi import Response
        import numpy as np
        import soundfile as sf
        import base64
        import json
        import traceback
        
        try:
            text = item.get("text")
            speed = item.get("speed", 1.0)
            brainwave = item.get("brainwave", "theta")
            binaural_vol = item.get("binaural_volume", 0.15)
            
            # RVC params
            use_voice_cloning = item.get("voice_conversion", False)
            pitch_shift = item.get("pitch_shift", 0)
            
            if not text:
                return Response(content="No text provided", status_code=400)
            
            print(f"Synthesizing {len(text)} chars (RVC: {use_voice_cloning})...")
            
            # 1. Generate with MeloTTS
            output_wav = "/tmp/output.wav"
            speaker_key = 'EN-Default' if 'EN-Default' in self.speaker_ids else list(self.speaker_ids.keys())[0]
            speaker_id = self.speaker_ids[speaker_key]
            
            self.tts.tts_to_file(text, speaker_id, output_wav, speed=speed)
            
            # 2. Apply RVC Voice Conversion (if enabled & available)
            if use_voice_cloning:
                if self.rvc_enabled:
                    print(f"Converting voice (pitch: {pitch_shift})...")
                    # Settings for RVC: f0_method='rmvpe' is best quality
                    self.rvc.infer_file(
                        input_path=output_wav, 
                        output_path=output_wav, # Overwrite
                        pitch=pitch_shift,
                        f0_method="rmvpe",
                        index_path=None # Optional .index path
                    )
                else:
                    print("Voice conversion requested but RVC model not loaded.")

            # 3. Add Binaural Beats
            data, sr = sf.read(output_wav)
            beat_freq = BRAINWAVES.get(brainwave, 0)
            
            if beat_freq > 0 and binaural_vol > 0:
                print(f"Adding {brainwave} beats ({beat_freq} Hz)...")
                t = np.linspace(0, len(data) / sr, len(data), dtype=np.float32)
                base_freq = 200
                left = np.sin(2 * np.pi * base_freq * t) * binaural_vol
                right = np.sin(2 * np.pi * (base_freq + beat_freq) * t) * binaural_vol
                beat = np.stack([left, right], axis=1)
                
                if len(data.shape) == 1:
                    data = np.stack([data, data], axis=1)
                
                # Ensure compatibility
                if data.shape[0] != beat.shape[0]:
                   min_len = min(data.shape[0], beat.shape[0])
                   data = data[:min_len]
                   beat = beat[:min_len]

                data = data + beat
                max_val = np.max(np.abs(data))
                if max_val > 1.0:
                    data = data / max_val
                
                sf.write(output_wav, data, sr)

            # 4. Convert to MP3
            from pydub import AudioSegment
            audio = AudioSegment.from_wav(output_wav)
            output_mp3 = "/tmp/output.mp3"
            audio.export(output_mp3, format="mp3", bitrate="128k")
            
            with open(output_mp3, "rb") as f:
                audio_content = f.read()
            
            audio_base64 = base64.b64encode(audio_content).decode('utf-8')
            print(f"Done! MP3: {len(audio_content) / 1024:.1f} KB")
            
            return {"audio_base64": audio_base64, "format": "mp3"}

        except Exception as e:
            print(f"Error: {e}\n{traceback.format_exc()}")
            return Response(
                content=json.dumps({"error": str(e)}),
                status_code=500,
                media_type="application/json"
            )
