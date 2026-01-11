"""
Combine meditation audio with binaural beats overlay.
"""
from pydub import AudioSegment
import os

# File paths
MEDITATION_FILE = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\src\assets\audio\deep_rest.mp3"
BINAURAL_FILE = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\Guided meditations\deep rest.wav"
OUTPUT_FILE = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\src\assets\audio\deep_rest_combined.mp3"

print("Loading meditation track...")
meditation = AudioSegment.from_mp3(MEDITATION_FILE)

print("Loading binaural beats...")
binaural = AudioSegment.from_wav(BINAURAL_FILE)

# If binaural is shorter than meditation, loop it
if len(binaural) < len(meditation):
    print(f"Looping binaural ({len(binaural)/1000:.1f}s) to match meditation ({len(meditation)/1000:.1f}s)...")
    loops_needed = (len(meditation) // len(binaural)) + 1
    binaural = binaural * loops_needed

# Trim binaural to match meditation length
binaural = binaural[:len(meditation)]

print("Overlaying tracks...")
combined = meditation.overlay(binaural)

print(f"Exporting to: {OUTPUT_FILE}")
combined.export(OUTPUT_FILE, format="mp3", bitrate="192k")

print("Done! Combined audio saved.")
print(f"Duration: {len(combined)/1000:.1f} seconds")
