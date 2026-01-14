import os
os.environ["COQUI_TOS_AGREED"] = "1"

import gradio as gr
import numpy as np
import tempfile
import soundfile as sf
import torch
try:
        from TTS.tts.configs.xtts_config import XttsConfig
        torch.serialization.add_safe_globals([XttsConfig])
except Exception:
        pass
    from TTS.api import TTS

# Initialize XTTS-v2 model
print("Loading XTTS-v2 model...")
# Using the specific model name ensures it downloads correctly
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
# Move to GPU if available, though Space is likely CPU basic
if torch.cuda.is_available():
        tts.to("cuda")
    print("XTTS-v2 model loaded!")

# Default reference audio (ensure this file exists in the Space)
DEFAULT_REF_AUDIO = "voice_sample.mp3"
DEFAULT_REF_TEXT = "Close your eyes and take a deep breath. Feel the tension leaving your body as you exhale slowly."

# Brainwave frequencies
BRAINWAVES = {
        "none": ("No binaural beats", 0),
        "delta": ("Deep sleep & healing", 2),
        "theta": ("Meditation & creativity", 6),
        "alpha": ("Relaxation & calm", 10),
        "beta": ("Focus & concentration", 18),
}

def generate_binaural_beat(duration, beat_freq, sample_rate=22050, base_freq=200, volume=0.15):
        if beat_freq <= 0:
                    return None
            
    t = np.linspace(0, duration, int(sample_rate * duration), dtype=np.float32)
    left = np.sin(2 * np.pi * base_freq * t) * volume
    right = np.sin(2 * np.pi * (base_freq + beat_freq) * t) * volume
    return np.stack([left, right], axis=1)

def synthesize(text, speed, brainwave, binaural_volume, ambient, ambient_volume, ref_audio, ref_text):
        if not text:
                    return None, "No text provided."
                # Use defaults if inputs are missing
                if not ref_audio:
                            ref_audio = DEFAULT_REF_AUDIO

                        print(f"Synthesizing: {text[:30]}...")

    # 1. Generate TTS Audio
    # Create a temp file for the TTS output
    # tts.tts_to_file requires a path
    tts_wav_path = tempfile.mktemp(suffix=".wav")

    try:
                # XTTS synthesis
                tts.tts_to_file(
                                text=text,
                                file_path=tts_wav_path,
                                speaker_wav=ref_audio,
                                language="en",
                                speed=speed
                )
    except Exception as e:
        return None, f"TTS Generation Error: {str(e)}"

    # 2. Load the generated audio
    data, sr = sf.read(tts_wav_path)

    # Check if we need to mix binaural beats
    beat_freq = BRAINWAVES.get(brainwave, (None, 0))[1]

    if beat_freq > 0 and binaural_volume > 0:
                duration = len(data) / sr
                # Generate beat matching duration and sample rate
                beat = generate_binaural_beat(duration, beat_freq, sample_rate=sr, volume=binaural_volume)

                if beat is not None:
                                # Ensure shapes match (handle mono/stereo)
                                if len(data.shape) == 1:
                                                    # Convert mono TTS to stereo by duplicating channel
                                                    data = np.stack([data, data], axis=1)

                                                # Pad beat if slightly different length due to rounding
                                                if len(beat) < len(data):
                                                    beat = np.pad(beat, ((0, len(data) - len(beat)), (0, 0)))
                                elif len(beat) > len(data):
                                                    beat = beat[:len(data)]

                                                # Mix
                                                data = data + beat

                                # Normalize to prevent clipping
                                max_val = np.max(np.abs(data))
                                if max_val > 1.0:
                                                    data = data / max_val

                                        # Save final output
                                        output_path = tempfile.mktemp(suffix=".wav")
    sf.write(output_path, data, sr)

    return output_path, "Success"

# Gradio Interface
with gr.Blocks() as demo:
        gr.Markdown("# XTTS-v2 Meditation Generator")

        with gr.Row():
                    with gr.Column():
                                    text_input = gr.Textbox(label="Meditation Script", lines=5, value="Close your eyes. Breathe deeply.")
                                    speed_slider = gr.Slider(label="Speed", minimum=0.5, maximum=2.0, value=1.0, step=0.1)

                        brainwave_dropdown = gr.Dropdown(
                                            label="Binaural Beat",
                                            choices=list(BRAINWAVES.keys()),
                                            value="theta",
                                            info="Select a brainwave frequency for entrainment."
                        )
                      binaural_vol = gr.Slider(label="Binaural Volume", minimum=0.0, maximum=1.0, value=0.15)

            # Ambient placeholders (inactive for now as we don't have the files in this simple script, but keeping args)
            ambient_dropdown = gr.Dropdown(label="Ambient Sound", choices=["none"], value="none", visible=False)
            ambient_vol = gr.Slider(label="Ambient Volume", minimum=0.0, maximum=1.0, value=0.0, visible=False)

            ref_audio_input = gr.Audio(label="Reference Voice (optional)", type="filepath", value=DEFAULT_REF_AUDIO)
            ref_text_input = gr.Textbox(label="Reference Text (optional)", value=DEFAULT_REF_TEXT, visible=False)

                      gen_btn = gr.Button("Generate Meditation")

        with gr.Column():
                        audio_output = gr.Audio(label="Generated Audio")
                        status_output = gr.Textbox(label="Status")

                gen_btn.click(
                            fn=synthesize,
                            inputs=[
                                            text_input, speed_slider, 
                                            brainwave_dropdown, binaural_vol, 
                                            ambient_dropdown, ambient_vol, 
                                            ref_audio_input, ref_text_input
                            ],
                            outputs=[audio_output, status_output]
                )

if __name__ == "__main__":
        # BIND TO 0.0.0.0:7860 FOR HF SPACES
        demo.launch(server_name="0.0.0.0", server_port=7860)
    
                            ]
                )