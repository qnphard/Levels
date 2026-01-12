# Piper TTS Hugging Face Space

This folder contains the files needed to deploy Piper TTS to Hugging Face Spaces.

## Files
- `app.py` - Main Gradio application
- `requirements.txt` - Python dependencies

## Deployment Steps

1. **Create a Hugging Face Account** (if you don't have one)
   - Go to [huggingface.co](https://huggingface.co) and sign up

2. **Create a New Space**
   - Click your profile → New Space
   - Name: `piper-tts-meditation` (or whatever you prefer)
   - SDK: **Gradio**
   - Hardware: **CPU Basic** (free)
   - Visibility: **Public** (free tier)

3. **Upload Files**
   - Upload `app.py` and `requirements.txt` to your Space
   - Or use git: `git clone https://huggingface.co/spaces/YOUR_USERNAME/piper-tts-meditation`

4. **Wait for Build**
   - The Space will build automatically (~2-5 minutes)
   - First request will download voice models (~100MB)

5. **Get Your API URL**
   - Your Space URL will be: `https://YOUR_USERNAME-piper-tts-meditation.hf.space`
   - API endpoint: `https://YOUR_USERNAME-piper-tts-meditation.hf.space/api/predict`

## Testing
Once deployed, visit your Space and test with sample text:
```
Take a deep breath... and let go of any tension in your body...
```

## Note on Cold Starts
Free Hugging Face Spaces sleep after ~15 minutes of inactivity.
First request after sleeping takes ~30-60 seconds to wake up.
