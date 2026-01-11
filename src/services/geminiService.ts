import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG } from '../config/aiConfig';
import { MeditationVibe } from '../data/meditationScripts';

const genAI = new GoogleGenerativeAI(AI_CONFIG.GEMINI_API_KEY);

export interface GenerationOptions {
    purpose: string;
    durationMinutes: number;
    vibe: MeditationVibe;
}

export const geminiService = {
    /**
     * Generates a professional meditation/hypnosis script based on research-backed structures.
     */
    generateScript: async (options: GenerationOptions): Promise<string> => {
        if (!AI_CONFIG.GEMINI_API_KEY) {
            throw new Error('Gemini API Key is missing. Please add it to aiConfig.ts');
        }

        try {
            const model = genAI.getGenerativeModel({ model: AI_CONFIG.MODEL_NAME });

            const structuralBlueprints: Record<MeditationVibe, string> = {
                mindfulness: `
          1. Arrival & Posture (0:45): Finding comfort.
          2. Breath Anchor (2:00): Noticing sensations.
          3. Body Scan (3:00): Softening regions.
          4. Open Monitoring (Duration%): Noticing thoughts, labeling ("thinking", "hearing").
          5. Compassion phrases (1:00): Metta phrases.
          6. Close (0:45): Carrying quality forward.
        `,
                clinical_hypnosis: `
          1. Pre-talk (0:30): Goal and safety reassurance.
          2. Induction (3:00): Eye-fixation or progressive relaxation.
          3. Deepener (2:00): Counting down 10 to 1.
          4. Therapeutic Suggestions (Duration%): Direct, sensory-rich, present-tense.
          5. Post-hypnotic anchor (0:30): Physical cue (e.g. thumb to finger).
          6. Re-orientation (1:30): Counting 1 to 5 to wake up (UNLESS SLEEP).
        `,
                ericksonian: `
          1. Pacing & Leading: Start by describing current reality, then drift.
          2. Artful Vagueness: Use "You may find," "Perhaps," "It's okay to."
          3. Metaphors: Use storytelling (e.g. clouds, rivers, dimming skies).
          4. Unconscious Engagement: Speak to the "part of you that knows how to heal."
        `,
                performance: `
          1. Intention (0:30): Clarity and focus.
          2. Breath + Count (2:00): Box breathing or 4-2-6 ratio.
          3. Guided Rehearsal (Duration%): Vivid first-person mental practice of success.
          4. Integration (2:00): Selecting a micro-cue for this state.
        `,
            };

            const prompt = `
        You are a world-class professional meditation guide and clinical hypnotherapist.
        Write a high-quality script for:
        - PURPOSE: ${options.purpose}
        - STYLE/VIBE: ${options.vibe}
        - DURATION: ${options.durationMinutes} minutes

        STRUCTURE BLUEPRINT FOR THIS VIBE:
        ${structuralBlueprints[options.vibe]}

        CRITICAL WRITING RULES:
        1. Reading Speed: 130 words per minute. Total words: ~${options.durationMinutes * 130}.
        2. Tone: Calm, premium, expert, and compassionate.
        3. NO stage directions, brackets, or speaker names. Output ONLY the spoken text.
        4. If purpose is 'sleep', NEVER include a wake-up/re-orientation at the end. End with drifting.
        5. Use positive suggestions only (what to DO, not what to stop doing).
        6. For '${options.vibe}', use its specific techniques discovered in research (e.g. labeling for mindfulness, anchors for hypnosis).
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text.trim();
        } catch (error) {
            console.error('Gemini Generation Error:', error);
            throw error;
        }
    }
};
