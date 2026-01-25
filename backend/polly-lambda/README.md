# Polly TTS Backend (Lambda + S3)

This backend exposes `POST /tts/polly` for the Expo app and calls **Amazon Polly (Neural)** safely (no AWS keys in the client).

## What it does

- Accepts text + options
- Chunks long text to fit Polly limits
- Synthesizes each chunk with Polly
- Uploads MP3 segments to S3
- Returns `audioUrls: string[]` (presigned URLs)

## Deploy (AWS SAM)

Prereqs:
- AWS account + credentials configured locally
- `sam` CLI installed

Steps:

```bash
cd backend/polly-lambda
npm i
npm run build
sam build
sam deploy --guided
```

After deploy, set the app env var:

- `EXPO_PUBLIC_TTS_API_URL=<your API Gateway base URL>`

## Request / Response

Request:

```json
{
  "text": "Hello...",
  "voiceId": "Joanna",
  "engine": "neural",
  "outputFormat": "mp3",
  "speed": 0.9
}
```

Response:

```json
{
  "audioUrls": ["https://...signed...", "https://...signed..."],
  "segments": 2
}
```

