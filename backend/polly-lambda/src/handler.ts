import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";

const region = process.env.AWS_REGION || "us-east-1";
const AUDIO_BUCKET = process.env.AUDIO_BUCKET;
const SIGNED_URL_TTL_SECONDS = Number(process.env.SIGNED_URL_TTL_SECONDS || "3600");
const ENABLE_AUDIO_MIXING = (process.env.ENABLE_AUDIO_MIXING || "0") === "1";
const FFMPEG_PATH = process.env.FFMPEG_PATH || "/opt/bin/ffmpeg";

const polly = new PollyClient({ region });
const s3 = new S3Client({ region });

type Engine = "standard" | "neural";
type OutputFormat = "mp3" | "ogg_vorbis" | "pcm";
type Ambient = "none" | "rain" | "ocean" | "forest" | "wind";
type Brainwave = "none" | "delta" | "theta" | "alpha" | "beta";

type RequestBody = {
  text: string;
  voiceId?: string;
  engine?: Engine;
  outputFormat?: OutputFormat;
  speed?: number; // 0.5..1.5 (client)
  // Optional audio layers (if ENABLE_AUDIO_MIXING=1 and ffmpeg is available, these can be baked into the mp3)
  ambient?: Ambient;
  ambientVolume?: number; // 0..0.5-ish from client UI
  brainwave?: Brainwave;
  binauralVolume?: number; // 0..0.5-ish from client UI
};

function json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST,OPTIONS,HEAD",
    },
    body: JSON.stringify(body),
  };
}

function headOk(): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST,OPTIONS,HEAD",
    },
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const AMBIENT_URLS: Record<Exclude<Ambient, "none">, string> = {
  rain: "https://actions.google.com/sounds/v1/weather/light_rain.ogg",
  ocean: "https://actions.google.com/sounds/v1/water/water_lapping_wind.ogg",
  forest: "https://actions.google.com/sounds/v1/weather/forest_wind_summer.ogg",
  wind: "https://actions.google.com/sounds/v1/weather/wind.ogg",
};

const BINAURAL_HZ: Record<Exclude<Brainwave, "none">, number> = {
  delta: 2,
  theta: 6,
  alpha: 10,
  beta: 18,
};

async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function runCmd(bin: string, args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += String(d)));
    p.on("error", reject);
    p.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`Command failed (${code}): ${bin} ${args.join(" ")}\n${stderr.slice(0, 800)}`));
    });
  });
}

async function concatMp3Parts(partPaths: string[], outPath: string) {
  const listPath = "/tmp/concat.txt";
  const list = partPaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n");
  await fs.writeFile(listPath, list, "utf8");

  // Fast path: stream copy
  try {
    await runCmd(FFMPEG_PATH, ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", outPath]);
    return;
  } catch {
    // Fallback: re-encode
    await runCmd(FFMPEG_PATH, [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "128k",
      outPath,
    ]);
  }
}

async function mixWithLayers({
  voicePath,
  outPath,
  ambient,
  ambientVolume,
  brainwave,
  binauralVolume,
}: {
  voicePath: string;
  outPath: string;
  ambient: Ambient;
  ambientVolume: number;
  brainwave: Brainwave;
  binauralVolume: number;
}) {
  const args: string[] = ["-y", "-i", voicePath];
  const filters: string[] = [];

  let inputIndex = 1;
  let amixInputs: string[] = ["[v]"];
  filters.push("[0:a]volume=1.0[v]");

  if (ambient !== "none") {
    const url = AMBIENT_URLS[ambient];
    args.push("-stream_loop", "-1", "-i", url);
    const vol = clamp(ambientVolume, 0, 1);
    filters.push(`[${inputIndex}:a]volume=${vol}[a]`);
    amixInputs.push("[a]");
    inputIndex += 1;
  }

  if (brainwave !== "none") {
    const beatHz = BINAURAL_HZ[brainwave];
    const carrier = 220;
    // Two sine sources (L/R) -> stereo binaural track
    args.push("-f", "lavfi", "-i", `sine=frequency=${carrier}:sample_rate=44100:d=3600`);
    args.push("-f", "lavfi", "-i", `sine=frequency=${carrier + beatHz}:sample_rate=44100:d=3600`);
    const leftIdx = inputIndex;
    const rightIdx = inputIndex + 1;
    inputIndex += 2;

    const vol = clamp(binauralVolume, 0, 1);
    filters.push(
      `[${leftIdx}:a][${rightIdx}:a]amerge=inputs=2,pan=stereo|c0<c0|c1<c1,volume=${vol}[b]`
    );
    amixInputs.push("[b]");
  }

  const amixCount = amixInputs.length;
  const filterComplex =
    filters.join(";") +
    `;${amixInputs.join("")}amix=inputs=${amixCount}:duration=first:dropout_transition=2,aresample=async=1[m]`;

  args.push(
    "-filter_complex",
    filterComplex,
    "-map",
    "[m]",
    "-c:a",
    "libmp3lame",
    "-b:a",
    "128k",
    "-shortest",
    outPath
  );

  await runCmd(FFMPEG_PATH, args);
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Polly limit is 3000 chars for SSML, but we use 2000 to be safe
const MAX_SSML_CHARS = 2000;

function buildSsml(text: string, speed: number) {
  // Polly prosody "rate" accepts: x-slow, slow, medium, fast, x-fast or a percentage.
  // We'll map 0.5..1.5 to 70%..110% for a more "meditation" pace by default.
  const s = clamp(speed || 1.0, 0.5, 1.5);
  const pct = Math.round(70 + ((s - 0.5) / 1.0) * 40); // 70..110

  // Normalize whitespace and add gentle pauses between sentences.
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  // IMPORTANT: escape user text first, then insert SSML tags.
  // If we escape after inserting tags, Polly will *speak* the tag text (e.g. "break time equals 350 milliseconds").
  const escaped = escapeXml(cleaned);

  // Insert small breaks after sentence-ending punctuation (on escaped text).
  const withPauses = escaped.replace(/([.!?])\s+/g, '$1 <break time="350ms"/> ');

  return `<speak><prosody rate="${pct}%">${withPauses}</prosody></speak>`;
}

function chunkByWords(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let cur = "";
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (next.length > maxChars && cur) {
      chunks.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

function chunkPlainText(text: string, maxChars: number) {
  const chunks: string[] = [];
  const normalized = text.replace(/\r\n/g, "\n").trim();

  // Split by sentences but keep punctuation.
  const sentences = normalized.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [normalized];

  let cur = "";
  for (const s of sentences) {
    const next = (cur + " " + s).trim();
    if (next.length > maxChars && cur) {
      chunks.push(cur);
      cur = s.trim();
    } else {
      cur = next;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

function ensureSsmlFits(text: string, speed: number, depth = 0): { text: string; ssml: string }[] {
  // Safety: prevent infinite recursion
  if (depth > 10) {
    // Last resort: just truncate the text
    const truncated = text.slice(0, 200);
    return [{ text: truncated, ssml: buildSsml(truncated, speed) }];
  }

  const ssml = buildSsml(text, speed);
  if (ssml.length <= MAX_SSML_CHARS) return [{ text, ssml }];

  // Split by sentences first, then by words if needed
  const sentences = text.match(/[^.!?]+[.!?]+(\s*)|[^.!?]+$/g) || [text];
  
  if (sentences.length > 1) {
    // Try splitting at sentence boundaries
    const mid = Math.floor(sentences.length / 2);
    const firstHalf = sentences.slice(0, mid).join("").trim();
    const secondHalf = sentences.slice(mid).join("").trim();
    return [
      ...ensureSsmlFits(firstHalf, speed, depth + 1),
      ...ensureSsmlFits(secondHalf, speed, depth + 1),
    ];
  }

  // Fall back to word-based splitting
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const mid = Math.floor(words.length / 2);
    const firstHalf = words.slice(0, mid).join(" ");
    const secondHalf = words.slice(mid).join(" ");
    return [
      ...ensureSsmlFits(firstHalf, speed, depth + 1),
      ...ensureSsmlFits(secondHalf, speed, depth + 1),
    ];
  }

  // Single long word - just truncate it
  const truncated = text.slice(0, 150);
  return [{ text: truncated, ssml: buildSsml(truncated, speed) }];
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    if (event.requestContext.http.method === "HEAD" && event.rawPath === "/health") {
      return headOk();
    }

    if (event.requestContext.http.method === "OPTIONS") {
      return headOk();
    }

    if (event.requestContext.http.method !== "POST") {
      return json(405, { error: "Method not allowed" });
    }

    if (!AUDIO_BUCKET) {
      return json(500, { error: "AUDIO_BUCKET not configured" });
    }

    const body: RequestBody = event.body ? JSON.parse(event.body) : ({} as any);
    const text = (body.text || "").trim();
    if (!text) return json(400, { error: "text is required" });

    const voiceId = body.voiceId || "Joanna";
    const engine: Engine = (body.engine || "neural") as Engine;
    const outputFormat: OutputFormat = (body.outputFormat || "mp3") as OutputFormat;
    const speed = clamp(body.speed ?? 1.0, 0.5, 1.5);

    const ambient: Ambient = (body.ambient || "none") as Ambient;
    const ambientVolume = clamp(Number(body.ambientVolume ?? 0.1), 0, 1);
    const brainwave: Brainwave = (body.brainwave || "none") as Brainwave;
    const binauralVolume = clamp(Number(body.binauralVolume ?? 0.15), 0, 1);

    const mixRequested =
      ENABLE_AUDIO_MIXING &&
      (ambient !== "none" || brainwave !== "none") &&
      outputFormat === "mp3" &&
      (await fileExists(FFMPEG_PATH));

    // Chunk the plain text so each SSML chunk stays under Polly limit.
    // SSML overhead can be significant: breaks (~25 chars each), escaping, prosody tags (~50 chars)
    const maxPlainChars = 600; // very conservative - SSML can triple the size
    const textChunks = chunkPlainText(text, maxPlainChars);

    const requestHash = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          text,
          voiceId,
          engine,
          outputFormat,
          speed,
          ambient,
          ambientVolume,
          brainwave,
          binauralVolume,
          mixRequested,
        })
      )
      .digest("hex")
      .slice(0, 24);

    const audioUrls: string[] = [];

    const ssmlChunks = textChunks.flatMap((chunk) => ensureSsmlFits(chunk, speed));

    const partPaths: string[] = [];

    for (let i = 0; i < ssmlChunks.length; i++) {
      const ssml = ssmlChunks[i].ssml;

      // Final safety check - Polly's actual limit is 3000 chars
      if (ssml.length > 3000) {
        console.error(`SSML chunk ${i} exceeds 3000 chars (${ssml.length}), truncating`);
        // This should never happen with our chunking, but handle it gracefully
        return json(400, { error: "A chunk exceeded Polly SSML limit. Reduce maxChars." });
      }

      const synth = await polly.send(
        new SynthesizeSpeechCommand({
          TextType: "ssml",
          Text: ssml,
          // AWS SDK type is a union of known VoiceIds; allow runtime strings.
          VoiceId: voiceId as any,
          Engine: engine,
          OutputFormat: outputFormat,
          SampleRate: outputFormat === "pcm" ? "16000" : undefined,
        })
      );

      if (!synth.AudioStream) {
        return json(500, { error: "Polly returned no AudioStream" });
      }

      const audioBytes = Buffer.from(await synth.AudioStream.transformToByteArray());

      const ext = outputFormat === "ogg_vorbis" ? "ogg" : outputFormat;
      const key = `polly/${requestHash}/part-${String(i).padStart(3, "0")}.${ext}`;

      if (mixRequested) {
        const partPath = `/tmp/part-${String(i).padStart(3, "0")}.mp3`;
        await fs.writeFile(partPath, audioBytes);
        partPaths.push(partPath);
        continue;
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: AUDIO_BUCKET,
          Key: key,
          Body: audioBytes,
          ContentType:
            outputFormat === "mp3"
              ? "audio/mpeg"
              : outputFormat === "ogg_vorbis"
              ? "audio/ogg"
              : "audio/pcm",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: AUDIO_BUCKET,
          Key: key,
        }),
        { expiresIn: SIGNED_URL_TTL_SECONDS }
      );

      audioUrls.push(url);
    }

    if (mixRequested) {
      const voicePath = "/tmp/voice.mp3";
      const mixedPath = "/tmp/mixed.mp3";

      await concatMp3Parts(partPaths, voicePath);
      await mixWithLayers({
        voicePath,
        outPath: mixedPath,
        ambient,
        ambientVolume,
        brainwave,
        binauralVolume,
      });

      const mixedBytes = await fs.readFile(mixedPath);
      const key = `polly/${requestHash}/mixed.mp3`;
      await s3.send(
        new PutObjectCommand({
          Bucket: AUDIO_BUCKET,
          Key: key,
          Body: mixedBytes,
          ContentType: "audio/mpeg",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: AUDIO_BUCKET,
          Key: key,
        }),
        { expiresIn: SIGNED_URL_TTL_SECONDS }
      );

      return json(200, { audioUrls: [url], segments: 1, mixed: true });
    }

    return json(200, { audioUrls, segments: audioUrls.length, mixed: false });
  } catch (err: any) {
    console.error(err);
    return json(500, { error: err?.message || "Internal error" });
  }
}

