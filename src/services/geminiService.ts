import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG } from '../config/aiConfig';

const genAI = new GoogleGenerativeAI(AI_CONFIG.GEMINI_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type MeditationPurpose =
   | 'sleepRest'
   | 'findingCalm'
   | 'focusClarity'
   | 'morningAwakening'
   | 'stressRelief'
   | 'selfCompassion';

export type MeditationStyle =
   | 'mindfulness'
   | 'ericksonian'
   | 'alignedAction'
   | 'lettingGo';

export type MeditationDuration = 'short' | 'medium' | 'long';

export interface GenerationOptions {
   purpose: MeditationPurpose;
   duration: MeditationDuration;
   style: MeditationStyle;
   binaural?: string;
   background?: string;
   voicePace?: number;
   userGoal?: string;
   avoidThemes?: string;
}

export interface ScriptSection {
   name: string;
   approxSeconds: number;
   lines: string[];
}

export interface SilenceCue {
   afterSectionName: string;
   seconds: number;
}

export interface GeneratedScript {
   title: string;
   intent: string;
   safety: string;
   sections: ScriptSection[];
   silenceCues: SilenceCue[];
   audioHints: {
      binaural: string;
      background: string;
      volumeAdvice?: string;
   };
}

// ─────────────────────────────────────────────────────────────────────────────
// HAWKINS-ALIGNED MAPPINGS
// ─────────────────────────────────────────────────────────────────────────────

const PURPOSE_CORE_MOVES: Record<MeditationPurpose, string> = {
   sleepRest: `
        Aim: Release mental grasping, soften the nervous system, surrender the day.
        Core Move: Allow heaviness, let thoughts pass, dissolve "unfinishedness".
        End with open-ended drifting—no wake-up language.
    `,
   findingCalm: `
        Aim: Stop fighting experience, return to witness.
        Core Move: Name what's here, allow it, relax resistance.
    `,
   focusClarity: `
        Aim: Clarity without forcing.
        Core Move: Release scattered attention, return to single-point awareness.
        Emphasize "relax into" rather than "push attention".
    `,
   morningAwakening: `
        Aim: Willingness, gratitude, intention.
        Core Move: Orient to service/truth, not egoic achievement.
        Include: "What matters most is truth, kindness, service."
    `,
   stressRelief: `
        Aim: Surrender control, exit the stress story-loop.
        Core Move: Feel the bodily stress (jaw, chest, gut), allow, release the compulsion to solve right now.
    `,
   selfCompassion: `
        Aim: Love/forgiveness, dissolve self-attack.
        Core Move: Soften toward the inner experience; accept the human moment.
        Include: "You don't have to earn worthiness."
    `,
};

const STYLE_BLUEPRINTS: Record<MeditationStyle, string> = {
   mindfulness: `
        MINDFULNESS (Witnessing)
        - Present-moment attention, non-judgment, breath/sensations
        - Gentle attention anchoring
        - Open monitoring
        - Periodic permission to do nothing
        - Soft, non-closing ending
    `,
   ericksonian: `
        ERICKSONIAN (Permissive Hypnotic)
        - Natural pacing and mirroring
        - Optional metaphors (weather, space, movement)
        - Permissive phrasing ONLY ("you may notice", "perhaps", "it's okay to")
        - NO induction, NO commands, NO unconscious directives
        - Never say "you will", "you must", "you are becoming"
    `,
   alignedAction: `
        ALIGNED ACTION (formerly "Performance")
        - Calm readiness without striving
        - "Clear attention", "settled energy", "natural readiness"
        - "Right action arises" — not "dominate" or "crush goals"
        - Reduction of internal friction
        - Integration without outcome visualization
    `,
   lettingGo: `
        LETTING GO (Hawkins Method) — Flagship Style
        The core sequence is:
        1. LOCATE: "Where do you feel it in the body?"
        2. ALLOW: "Let it be exactly as it is."
        3. SOFTEN: "Let the resistance relax."
        4. RELEASE STORY: "No need to solve—just feel."
        5. REST AS AWARENESS: "Notice what is aware of this."
        
        Use this structure explicitly. Minimal words, maximum spaciousness.
    `,
};

const DURATION_BUDGETS: Record<MeditationDuration, string> = {
   short: `
        Duration: 3-5 minutes
        - 0:00–0:30  Arrival & permission
        - 0:30–2:45  Core practice
        - 2:45–end   Closing + carry-forward
    `,
   medium: `
        Duration: 5-10 minutes
        - 0:00–1:00  Arrival + grounding
        - 1:00–7:30  Core practice (2 waves)
        - 7:30–end   Integration + closing
    `,
   long: `
        Duration: 15-20 minutes
        - 0:00–2:00   Arrival + body settling
        - 2:00–14:00  Core practice (3 waves + deeper silence)
        - 14:00–end   Integration + closing
        
        LONGER ≠ MORE WORDS. Longer = more silence, slower pacing, fewer concepts.
    `,
};

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT (The Constitution)
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You generate meditation scripts for the Levels app, aligned with David R. Hawkins' consciousness principles.

═══════════════════════════════════════════════════════════════════════════════
NORTH STAR
═══════════════════════════════════════════════════════════════════════════════

Your meditations are NOT for "fixing" the person.
They REVEAL what's already true by gently dissolving resistance.

The meditation's job is to:
• Restore Presence (the witness is already free)
• Allow feeling without story (letting go of resistance)
• Invite surrender (release the "I must control this" stance)
• Orient toward love/acceptance (nonjudgment, compassion, humility)
• Support right action from clarity (not from fear/force)

═══════════════════════════════════════════════════════════════════════════════
NON-NEGOTIABLE INTEGRITY RULES
═══════════════════════════════════════════════════════════════════════════════

LANGUAGE RULES (High-Calibrating Tone):
✓ USE:
  - Permission-based: "If you'd like…", "You might notice…", "It's okay to…"
  - Non-striving: "No need to force anything."
  - Humility: "See what's true for you."
  - Compassion: "Meet this gently."

✗ AVOID:
  - Commands implying control: "You will now…", "You are becoming…", "You must…"
  - Absolutes/guarantees: "This will heal…", "This always works…"
  - Fear/urgency: "Do this now or…"
  - Shame-based framing: "fix yourself", "what's wrong with you"
  - Aggressive reprogramming: "dominate", "crush", "unstoppable", "manifest results"

SAFETY RULES:
• ALWAYS include in the closing:
  "If anything feels too intense, you can open your eyes, feel your feet, and pause."

• If the script touches heavy themes (panic, despair, dissociation), add:
  "If you're in crisis or at risk of harm, please seek immediate local support."

OTHER RULES:
• No medical claims, no guaranteed outcomes
• No mention of "calibration numbers" or claims about consciousness levels
• Prefer fewer concepts, more spaciousness
• Reading speed: 130 words per minute (calculate word count accordingly)
• Tone: calm, grounded, neutral, human—no expert signaling, no spiritual authority

═══════════════════════════════════════════════════════════════════════════════
PHRASE BANK (High-Quality, Non-Forceful)
═══════════════════════════════════════════════════════════════════════════════

"You might notice…"
"If it feels okay…"
"Let this be here without needing it to change."
"No need to rush."
"Just for now, you can set down the story."
"There's nothing to fix right now."
"What's already here?"
"Let the body be as it is."
"You don't have to earn worthiness."

═══════════════════════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════════════════

You MUST output valid JSON matching this schema:
{
  "title": "Short descriptive title",
  "intent": "One sentence describing the meditation's purpose",
  "safety": "If anything feels too intense, you can open your eyes, feel your feet, and pause.",
  "sections": [
    {
      "name": "Arrival",
      "approxSeconds": 30,
      "lines": ["First spoken line.", "Second spoken line."]
    }
  ],
  "silenceCues": [
    {"afterSectionName": "Core Practice", "seconds": 5}
  ],
  "audioHints": {
    "binaural": "Theta",
    "background": "Ocean",
    "volumeAdvice": "Keep binaural beats at low volume."
  }
}

SECTION STRUCTURE (required order):
1. Arrival (breath/body orientation)
2. Permission + Safety (1-2 sentences)
3. Core Practice (depends on Purpose + Style)
4. Integration (bring it into life)
5. Closing (gratitude + autonomy + safety)

Each "lines" array should contain SHORT, speakable sentences—one thought per line.

═══════════════════════════════════════════════════════════════════════════════
PAUSE MARKERS (Critical for Natural Speech)
═══════════════════════════════════════════════════════════════════════════════

To avoid robotic delivery, INSERT PAUSE MARKERS throughout the script:

• Use "..." (three dots) for short pauses (1-2 seconds) — between phrases
• Use "[pause]" for medium pauses (3-5 seconds) — after important statements
• Use "[breathe]" for breath cues (5-7 seconds) — inviting conscious breaths

PLACEMENT RULES:
• After every 1-2 sentences, add "..." or "[pause]"
• After arrival/grounding instructions, add "[breathe]"
• Before transitions between sections, add "[pause]"
• After invitations to notice something, add "..." to let them notice
• During "Letting Go" style, add "[pause]" after each step (Locate, Allow, Soften, etc.)

EXAMPLE:
"Notice where your body makes contact with the surface beneath you... [pause] There's nothing to do right now... [breathe] Just this moment, as it is."

NEVER create long blocks of continuous speech. The script should feel spacious.
`;

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const geminiService = {
   /**
    * Generates a Hawkins-aligned meditation script with structured JSON output.
    */
   generateScript: async (options: GenerationOptions): Promise<GeneratedScript> => {
      if (!AI_CONFIG.GEMINI_API_KEY) {
         throw new Error('Gemini API Key is missing. Please add it to aiConfig.ts');
      }

      const {
         purpose,
         duration,
         style,
         binaural = 'none',
         background = 'none',
         voicePace = 1.0,
         userGoal,
         avoidThemes,
      } = options;

      const model = genAI.getGenerativeModel({
         model: AI_CONFIG.MODEL_NAME,
         systemInstruction: SYSTEM_PROMPT,
      });

      const userPrompt = `
Generate a meditation JSON with the required schema.

PURPOSE: ${purpose}
${PURPOSE_CORE_MOVES[purpose]}

DURATION: ${duration}
${DURATION_BUDGETS[duration]}

STYLE: ${style}
${STYLE_BLUEPRINTS[style]}

BINAURAL: ${binaural}
BACKGROUND: ${background}
VOICE PACE: ${voicePace}

${userGoal ? `USER GOAL: "${userGoal}"` : ''}
${avoidThemes ? `AVOID THEMES: "${avoidThemes}"` : ''}

Output ONLY valid JSON. No markdown, no code blocks, no explanation.
`;

      try {
         const result = await model.generateContent(userPrompt);
         const response = await result.response;
         let text = response.text().trim();

         // Strip markdown code blocks if present
         if (text.startsWith('```json')) {
            text = text.slice(7);
         }
         if (text.startsWith('```')) {
            text = text.slice(3);
         }
         if (text.endsWith('```')) {
            text = text.slice(0, -3);
         }
         text = text.trim();

         const script: GeneratedScript = JSON.parse(text);

         // Integrity check: ensure safety line exists
         if (!script.safety || script.safety.length < 10) {
            script.safety = 'If anything feels too intense, you can open your eyes, feel your feet, and pause.';
         }

         return script;
      } catch (error) {
         console.error('Gemini Generation Error:', error);
         throw error;
      }
   },

   /**
    * Converts a GeneratedScript to plain speakable text for TTS.
    */
   scriptToText: (script: GeneratedScript): string => {
      const lines: string[] = [];

      for (const section of script.sections) {
         lines.push(...section.lines);
      }

      return lines.join(' ');
   },
};
