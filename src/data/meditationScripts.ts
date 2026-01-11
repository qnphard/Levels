/**
 * Meditation Script Templates
 * Used for generating dynamic meditation content
 */

export type MeditationPurpose =
    | 'sleep'
    | 'calm'
    | 'focus'
    | 'morning'
    | 'stress_relief'
    | 'self_compassion';

export type MeditationDuration = 5 | 10 | 15 | 20;

interface ScriptSection {
    type: 'intro' | 'breathing' | 'body' | 'visualization' | 'affirmation' | 'closing';
    text: string;
    pauseAfter?: number; // seconds of silence after this section
}

// Opening phrases by purpose
const OPENINGS: Record<MeditationPurpose, string[]> = {
    sleep: [
        "Welcome to this moment of rest. Allow yourself to slowly let go of the day.",
        "As you prepare for sleep, give yourself permission to release all tension.",
        "This is your time to surrender to stillness and drift into peaceful rest.",
    ],
    calm: [
        "Welcome to this moment of peace. Whatever brought you here, know that you are exactly where you need to be.",
        "Take a moment to acknowledge yourself for choosing calm over chaos.",
        "In this space, there is nothing to fix, nothing to solve. Simply be.",
    ],
    focus: [
        "Welcome. In this practice, we cultivate clarity and presence.",
        "Set your intention now: to be fully here, fully aware.",
        "Let go of distractions. This moment is all that matters.",
    ],
    morning: [
        "Good morning. This is a new beginning, a fresh start.",
        "As you wake, greet this day with openness and gratitude.",
        "Let this practice set the tone for a conscious, intentional day.",
    ],
    stress_relief: [
        "Welcome. Right now, in this moment, you are safe.",
        "Whatever you're carrying, you can set it down, even just for these few minutes.",
        "Your nervous system is ready to return to calm. Let's guide it there.",
    ],
    self_compassion: [
        "Welcome to this practice of self-kindness.",
        "You deserve the same compassion you so freely give to others.",
        "In this space, there is no judgment, only acceptance and love.",
    ],
};

// Breathing instructions
const BREATHING: string[] = [
    "Begin by taking a deep breath in through your nose. Hold for a moment. And slowly release through your mouth.",
    "Let your breath find its natural rhythm. There's no need to control it.",
    "With each exhale, release a little more tension. With each inhale, welcome peace.",
    "Notice the gentle rise and fall of your chest. This is your anchor to the present.",
    "Breathe in calm... Breathe out tension. Breathe in peace... Breathe out worry.",
];

// Body scan sections (short)
const BODY_SCAN_SHORT: string[] = [
    "Bring your attention to your feet. Notice any sensations there. Allow them to relax completely.",
    "Now move your awareness up to your legs. Let any tension melt away.",
    "Feel your hips and lower back. Release any tightness you're holding there.",
    "Notice your shoulders. With each exhale, let them drop a little lower.",
    "Soften your face. Unclench your jaw. Let your eyes rest gently closed.",
];

// Visualizations by purpose
const VISUALIZATIONS: Record<MeditationPurpose, string[]> = {
    sleep: [
        "Imagine yourself floating on a calm, warm ocean. The waves gently rock you deeper into relaxation.",
        "Picture a soft, warm light surrounding you, like a cocoon of comfort and safety.",
        "Envision yourself sinking into a cloud, soft and weightless, drifting toward peaceful sleep.",
    ],
    calm: [
        "Picture yourself in a peaceful meadow. A gentle breeze touches your skin.",
        "Imagine standing by a still lake. The water reflects the calm you feel within.",
        "Visualize a warm, golden light filling your body with each breath.",
    ],
    focus: [
        "Imagine your mind as a clear blue sky. Thoughts are clouds that pass without disturbing the stillness.",
        "Picture a single flame, steady and unwavering. Your focus is just as stable.",
        "Envision a mountain, solid and unmoved by the winds around it. You are that mountain.",
    ],
    morning: [
        "Picture the sunrise, painting the sky in warm colors. This new day holds infinite possibility.",
        "Imagine light slowly filling your body, awakening every cell with energy and clarity.",
        "Visualize yourself moving through this day with ease, grace, and presence.",
    ],
    stress_relief: [
        "Imagine stress as dark smoke, leaving your body with each exhale.",
        "Picture yourself in a protective bubble where nothing harmful can reach you.",
        "Visualize placing your worries in a box, setting it aside. They'll be there later if you need them.",
    ],
    self_compassion: [
        "Imagine yourself as a young child. What would you say to comfort them? Say that now to yourself.",
        "Picture someone who loves you unconditionally. Feel their warmth surrounding you.",
        "Visualize your heart glowing with a soft, warm light of self-acceptance.",
    ],
};

// Affirmations by purpose
const AFFIRMATIONS: Record<MeditationPurpose, string[]> = {
    sleep: [
        "I release this day with gratitude. Sleep comes easily to me.",
        "My body knows how to rest. I trust the process of letting go.",
        "I am safe. I am at peace. I am ready for restorative sleep.",
    ],
    calm: [
        "I am calm. I am centered. I am at peace.",
        "In this moment, all is well.",
        "I choose peace over worry. I choose presence over distraction.",
    ],
    focus: [
        "My mind is clear and focused.",
        "I accomplish what I set out to do with ease and clarity.",
        "I am fully present. I am fully engaged.",
    ],
    morning: [
        "Today is full of opportunity. I am ready to receive it.",
        "I greet this day with energy, gratitude, and openness.",
        "I am capable, I am focused, I am ready.",
    ],
    stress_relief: [
        "I release what I cannot control. I focus on what I can.",
        "This too shall pass. I will get through this.",
        "My peace is more important than being right or being perfect.",
    ],
    self_compassion: [
        "I am worthy of love exactly as I am.",
        "I forgive myself. I am doing the best I can.",
        "I treat myself with the same kindness I offer others.",
    ],
};

// Closing phrases
const CLOSINGS: Record<MeditationPurpose, string[]> = {
    sleep: [
        "Allow yourself to drift now into peaceful, restorative sleep. Good night.",
        "Let go completely. Sleep is here to embrace you.",
    ],
    calm: [
        "Carry this peace with you. It's always available, one breath away.",
        "When you're ready, gently open your eyes, bringing this calm into your day.",
    ],
    focus: [
        "You are focused. You are ready. Open your eyes and begin.",
        "Take this clarity with you into whatever comes next.",
    ],
    morning: [
        "You are awake, alert, and ready for this day. Rise with intention.",
        "This day is yours. Make it meaningful. Open your eyes and begin.",
    ],
    stress_relief: [
        "Remember: you can return to this calm anytime, with just a few breaths.",
        "The peace you found here is always within you. Carry it forward.",
    ],
    self_compassion: [
        "You are loved. You are enough. Carry this truth with you.",
        "Be gentle with yourself today. You deserve it.",
    ],
};

// Helper function to pick random item
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a meditation script
export function generateMeditationScript(
    purpose: MeditationPurpose,
    durationMinutes: MeditationDuration
): ScriptSection[] {
    const sections: ScriptSection[] = [];

    // Introduction
    sections.push({
        type: 'intro',
        text: pickRandom(OPENINGS[purpose]),
        pauseAfter: 3,
    });

    // Initial breathing
    sections.push({
        type: 'breathing',
        text: BREATHING[0],
        pauseAfter: 5,
    });

    sections.push({
        type: 'breathing',
        text: pickRandom(BREATHING.slice(1)),
        pauseAfter: 5,
    });

    // For longer meditations, add body scan
    if (durationMinutes >= 10) {
        BODY_SCAN_SHORT.slice(0, Math.min(3, durationMinutes / 5)).forEach(text => {
            sections.push({
                type: 'body',
                text,
                pauseAfter: 4,
            });
        });
    }

    // Visualization
    sections.push({
        type: 'visualization',
        text: pickRandom(VISUALIZATIONS[purpose]),
        pauseAfter: 8,
    });

    // For longer meditations, add more content
    if (durationMinutes >= 15) {
        sections.push({
            type: 'breathing',
            text: pickRandom(BREATHING),
            pauseAfter: 5,
        });
        sections.push({
            type: 'visualization',
            text: pickRandom(VISUALIZATIONS[purpose]),
            pauseAfter: 8,
        });
    }

    // Affirmation
    sections.push({
        type: 'affirmation',
        text: pickRandom(AFFIRMATIONS[purpose]),
        pauseAfter: 5,
    });

    if (durationMinutes >= 10) {
        sections.push({
            type: 'affirmation',
            text: pickRandom(AFFIRMATIONS[purpose]),
            pauseAfter: 5,
        });
    }

    // Closing
    sections.push({
        type: 'closing',
        text: pickRandom(CLOSINGS[purpose]),
        pauseAfter: 0,
    });

    return sections;
}

// Convert sections to full text
export function sectionsToText(sections: ScriptSection[]): string {
    return sections.map(s => s.text).join('\n\n');
}

// Purpose display names
export const PURPOSE_LABELS: Record<MeditationPurpose, string> = {
    sleep: 'Sleep & Rest',
    calm: 'Finding Calm',
    focus: 'Focus & Clarity',
    morning: 'Morning Awakening',
    stress_relief: 'Stress Relief',
    self_compassion: 'Self-Compassion',
};

// Duration labels
export const DURATION_LABELS: Record<MeditationDuration, string> = {
    5: '5 minutes',
    10: '10 minutes',
    15: '15 minutes',
    20: '20 minutes',
};
