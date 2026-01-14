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
          - Arrival and orientation
          - Gentle attention anchoring
          - Open monitoring
          - Periodic permission to do nothing
          - Soft, non-closing ending
        `,
                ericksonian: `
          - Natural pacing and mirroring
          - Optional metaphors (weather, space, movement)
          - Permissive phrasing ("you may notice", "perhaps")
          - No induction, no suggestion, no unconscious directives
        `,
                performance: `
          - Present-moment grounding
          - Orientation toward steadiness and clarity
          - Reduction of internal friction
          - Integration without outcome visualization
        `,
            };

            const prompt = `
        You are a world-class professional meditation guide and clinical hypnotherapist.
        Your role is not to instruct, persuade, or induce change, but to gently orient attention
        and create conditions in which natural settling, clarity, or rest may occur.

        Write a high-quality spoken script based on the following inputs:
        - PURPOSE: \${options.purpose}
        - STYLE/VIBE: \${options.vibe}
        - DURATION: \${options.durationMinutes} minutes

        ────────────────────────
        GLOBAL INTEGRITY RULES (OVERRIDE ALL OTHERS):

        1. Non-coercion
           - Do not attempt to cause, induce, or guarantee outcomes.
           - Do not imply that change comes from the guide or the script.
           - The user remains autonomous at all times.

        2. Subtractive orientation
           - Frame change as allowing, noticing, or ceasing interference.
           - Avoid effort-based, achievement-based, or improvement language.

        3. No identity assignment
           - Do not define who the user is.
           - Do not imply progress, levels, advancement, or deficiency.

        4. Experiential language only
           - Describe sensations, perceptions, and awareness.
           - Invite recognition, not belief or compliance.

        5. Impermanence
           - States arise and pass naturally.
           - Nothing is owned, fixed, or achieved.

        ────────────────────────
        STYLE BLUEPRINTS:
        \${structuralBlueprints[options.vibe]}

        ────────────────────────
        CRITICAL CONSTRAINTS:

        1. Reading speed: 130 words per minute.
           - Calculate total word count accordingly.

        2. Tone:
           - Calm, grounded, neutral, human.
           - No expert signaling, no spiritual authority.

        3. Output:
           - Spoken text only.
           - No labels, explanations, or stage directions.

        4. Sleep rule:
           - If PURPOSE is 'sleep', do not include re-orientation or wake-up language.
           - End with open-ended drifting.

        5. Language:
           - Avoid commands ("relax", "focus", "let go").
           - Use gentle, permissive phrasing only.

        ────────────────────────
        GOAL:
        Produce a script that feels like a steady, non-intrusive presence,
        supporting natural settling without effort, pressure, or expectation.
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
