import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";

const region = process.env.AWS_REGION || "us-east-1";
/** Per AWS Polly docs — generative is not available in e.g. eu-west-1 (Ireland). */
const GENERATIVE_ENGINE_REGIONS = new Set([
  "us-east-1",
  "eu-central-1",
  "us-west-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-southeast-1",
  "eu-west-2",
  "ca-central-1",
]);
/** Long-form engine is only in us-east-1 per Polly docs (unlike generative). */
const LONG_FORM_ENGINE_REGIONS = new Set(["us-east-1"]);
const AUDIO_BUCKET = process.env.AUDIO_BUCKET;
const SIGNED_URL_TTL_SECONDS = Number(process.env.SIGNED_URL_TTL_SECONDS || "3600");
const ENABLE_AUDIO_MIXING = (process.env.ENABLE_AUDIO_MIXING || "0") === "1";
const FFMPEG_PATH = process.env.FFMPEG_PATH || "/opt/bin/ffmpeg";

const polly = new PollyClient({ region });
const s3 = new S3Client({ region });

type Engine = "standard" | "neural" | "generative" | "long-form";
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

/** Private-use chars — unlikely in user meditation text — hold slots until after escapeXml */
const PH = {
  breathe: "\uE020",
  pause: "\uE021",
  ellipsis: "\uE022",
  para: "\uE023",
} as const;

/**
 * Map Gemini stage markers to placeholders, escape spoken text, then substitute SSML breaks.
 * [breathe], [pause], ... and paragraph breaks become silent pauses (not spoken).
 */
function plainTextToSsmlInner(text: string): string {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, PH.para)
    .replace(/\n/g, " ")
    .replace(/\[breathe\]/gi, PH.breathe)
    .replace(/\[pause\]/gi, PH.pause)
    .replace(/\.{3}/g, PH.ellipsis)
    .trim();

  let escaped = escapeXml(normalized);
  escaped = escaped
    .replace(new RegExp(PH.breathe, "g"), '<break time="500ms"/>')
    .replace(new RegExp(PH.pause, "g"), '<break time="350ms"/>')
    .replace(new RegExp(PH.ellipsis, "g"), '<break time="200ms"/>')
    .replace(new RegExp(PH.para, "g"), '<break time="700ms"/>');

  // Gentle pauses after sentence-ending punctuation (already escaped).
  return escaped.replace(/([.!?])\s+/g, '$1 <break time="350ms"/> ');
}

function buildSsml(text: string, speed: number) {
  // Polly prosody "rate" accepts: x-slow, slow, medium, fast, x-fast or a percentage.
  // We'll map 0.5..1.5 to 70%..110% for a more "meditation" pace by default.
  const s = clamp(speed || 1.0, 0.5, 1.5);
  const pct = Math.round(70 + ((s - 0.5) / 1.0) * 40); // 70..110

  const inner = plainTextToSsmlInner(text);
  // Neural engine does not support prosody `pitch`; omit it so generative→neural fallback works.
  return `<speak><prosody rate="${pct}%">${inner}</prosody></speak>`;
}

function isEngineNotSupportedError(err: unknown): boolean {
  const e = err as { name?: string; Code?: string; message?: string };
  if (e?.name === "EngineNotSupportedException") return true;
  if (e?.Code === "EngineNotSupportedException") return true;
  const msg = String(e?.message ?? err ?? "");
  // Polly in unsupported regions often returns message "Invalid Engine parameter" (not EngineNotSupportedException).
  return /EngineNotSupported|engine.*not.*supported|Invalid Engine parameter/i.test(msg);
}

function normalizeEngineForRegion(engine: Engine, awsRegion: string): Engine {
  if (engine === "generative" && !GENERATIVE_ENGINE_REGIONS.has(awsRegion)) {
    console.warn("Polly generative engine not available in this region; using neural", { awsRegion });
    return "neural";
  }
  if (engine === "long-form" && !LONG_FORM_ENGINE_REGIONS.has(awsRegion)) {
    console.warn("Polly long-form engine only in us-east-1; using neural", { awsRegion });
    return "neural";
  }
  return engine;
}

/** Neural has a smaller SSML surface than standard/generative (e.g. some prosody). */
function isUnsupportedNeuralFeatureError(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message ?? err ?? "");
  return /Unsupported Neural feature/i.test(msg);
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

type ChunkSynthResult = {
  index: number;
  bytes: Buffer;
  engineUsed: Engine;
  chunkFallback: boolean;
};

/** One Polly call with generative→neural→standard fallbacks (same as previous sequential loop). */
async function synthesizeSsmlChunk(
  ssml: string,
  index: number,
  voiceId: string,
  engine: Engine,
  outputFormat: OutputFormat
): Promise<ChunkSynthResult> {
  if (ssml.length > 3000) {
    throw new Error(`SSML chunk ${index} exceeds 3000 chars (${ssml.length})`);
  }

  let engineUsed: Engine = engine;
  let chunkFallback = false;
  let synth;

  try {
    synth = await polly.send(
      new SynthesizeSpeechCommand({
        TextType: "ssml",
        Text: ssml,
        VoiceId: voiceId as any,
        Engine: engineUsed as any,
        OutputFormat: outputFormat,
        SampleRate: outputFormat === "pcm" ? "16000" : undefined,
      })
    );
  } catch (firstErr: unknown) {
    if (engineUsed === "generative" && isEngineNotSupportedError(firstErr)) {
      console.warn("Polly generative not supported for this voice; retrying neural", { voiceId, index });
      engineUsed = "neural";
      try {
        synth = await polly.send(
          new SynthesizeSpeechCommand({
            TextType: "ssml",
            Text: ssml,
            VoiceId: voiceId as any,
            Engine: "neural",
            OutputFormat: outputFormat,
            SampleRate: outputFormat === "pcm" ? "16000" : undefined,
          })
        );
      } catch (neuralErr: unknown) {
        if (isUnsupportedNeuralFeatureError(neuralErr)) {
          console.warn("Polly neural rejected SSML; retrying standard", { voiceId, index });
          engineUsed = "standard";
          synth = await polly.send(
            new SynthesizeSpeechCommand({
              TextType: "ssml",
              Text: ssml,
              VoiceId: voiceId as any,
              Engine: "standard",
              OutputFormat: outputFormat,
              SampleRate: outputFormat === "pcm" ? "16000" : undefined,
            })
          );
        } else {
          throw neuralErr;
        }
      }
    } else if (engineUsed === "neural" && isUnsupportedNeuralFeatureError(firstErr)) {
      console.warn("Polly neural rejected SSML; retrying standard", { voiceId, index });
      engineUsed = "standard";
      synth = await polly.send(
        new SynthesizeSpeechCommand({
          TextType: "ssml",
          Text: ssml,
          VoiceId: voiceId as any,
          Engine: "standard",
          OutputFormat: outputFormat,
          SampleRate: outputFormat === "pcm" ? "16000" : undefined,
        })
      );
    } else {
      throw firstErr;
    }
  }

  if (engine === "generative" && engineUsed !== "generative") {
    chunkFallback = true;
  }

  if (!synth!.AudioStream) {
    throw new Error("Polly returned no AudioStream");
  }

  const bytes = Buffer.from(await synth!.AudioStream.transformToByteArray());
  return { index, bytes, engineUsed, chunkFallback };
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
    const rawEngine = (body.engine || "generative") as string;
    const engine: Engine = normalizeEngineForRegion(
      (["standard", "neural", "generative", "long-form"].includes(rawEngine) ? rawEngine : "generative") as Engine,
      region
    );
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
    let reportedEngine: Engine = engine;
    let engineFallback = false;

    // Parallel Polly calls — sequential was too slow for 5–10+ min scripts and can exceed API Gateway limits.
    const chunkResults = await Promise.all(
      ssmlChunks.map((c, i) => synthesizeSsmlChunk(c.ssml, i, voiceId, engine, outputFormat))
    );
    chunkResults.sort((a, b) => a.index - b.index);

    for (const r of chunkResults) {
      reportedEngine = r.engineUsed;
      if (r.chunkFallback) engineFallback = true;
    }

    const ext = outputFormat === "ogg_vorbis" ? "ogg" : outputFormat;

    for (const r of chunkResults) {
      const i = r.index;
      const audioBytes = r.bytes;

      if (mixRequested) {
        const partPath = `/tmp/part-${String(i).padStart(3, "0")}.mp3`;
        await fs.writeFile(partPath, audioBytes);
        partPaths.push(partPath);
        continue;
      }

      // Non-mixed: stash part paths for optional single-file concat (avoids client-side multi-segment bugs).
      if (outputFormat === "mp3") {
        const partPath = `/tmp/part-${String(i).padStart(3, "0")}.mp3`;
        await fs.writeFile(partPath, audioBytes);
        partPaths.push(partPath);
      } else {
        const key = `polly/${requestHash}/part-${String(i).padStart(3, "0")}.${ext}`;
        await s3.send(
          new PutObjectCommand({
            Bucket: AUDIO_BUCKET,
            Key: key,
            Body: audioBytes,
            ContentType:
              outputFormat === "ogg_vorbis" ? "audio/ogg" : "audio/pcm",
            CacheControl: "public, max-age=31536000, immutable",
          })
        );
        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: AUDIO_BUCKET, Key: key }),
          { expiresIn: SIGNED_URL_TTL_SECONDS }
        );
        audioUrls.push(url);
      }
    }

    // Voice-only MP3: merge parts into one file when possible (Expo AV often drops audio after 1st segment when chaining URLs).
    if (!mixRequested && outputFormat === "mp3" && partPaths.length > 0) {
      let mergedOk = false;
      if (partPaths.length > 1 && (await fileExists(FFMPEG_PATH))) {
        try {
          const voicePath = "/tmp/voice-merged.mp3";
          await concatMp3Parts(partPaths, voicePath);
          const mergedBytes = await fs.readFile(voicePath);
          const mergedKey = `polly/${requestHash}/merged.mp3`;
          await s3.send(
            new PutObjectCommand({
              Bucket: AUDIO_BUCKET,
              Key: mergedKey,
              Body: mergedBytes,
              ContentType: "audio/mpeg",
              CacheControl: "public, max-age=31536000, immutable",
            })
          );
          const mergedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: AUDIO_BUCKET, Key: mergedKey }),
            { expiresIn: SIGNED_URL_TTL_SECONDS }
          );
          audioUrls.length = 0;
          audioUrls.push(mergedUrl);
          mergedOk = true;
        } catch (e) {
          console.error("merge mp3 parts failed, falling back to per-part URLs", e);
        }
      }
      if (!mergedOk) {
        audioUrls.length = 0;
        for (let i = 0; i < partPaths.length; i++) {
          const key = `polly/${requestHash}/part-${String(i).padStart(3, "0")}.mp3`;
          const bodyBuf = await fs.readFile(partPaths[i]);
          await s3.send(
            new PutObjectCommand({
              Bucket: AUDIO_BUCKET,
              Key: key,
              Body: bodyBuf,
              ContentType: "audio/mpeg",
              CacheControl: "public, max-age=31536000, immutable",
            })
          );
          const url = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: AUDIO_BUCKET, Key: key }),
            { expiresIn: SIGNED_URL_TTL_SECONDS }
          );
          audioUrls.push(url);
        }
      }
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

      return json(200, {
        audioUrls: [url],
        segments: 1,
        mixed: true,
        engine: reportedEngine,
        engineFallback,
      });
    }

    return json(200, {
      audioUrls,
      segments: audioUrls.length,
      mixed: false,
      engine: reportedEngine,
      engineFallback,
    });
  } catch (err: any) {
    console.error(err);
    return json(500, { error: err?.message || "Internal error" });
  }
}

