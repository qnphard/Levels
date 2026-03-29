import { MEDITATION_DURATION_MIN_WORDS } from '../config/meditationDuration';

/**
 * Neutral permissive lines + TTS pause markers. Appended only when the model/script
 * is below the minimum word target so audio length matches the chosen duration tier.
 */
const PAD_LINES: readonly string[] = [
    'If it feels okay... let the shoulders soften a little more... [pause]',
    'Nothing here needs to be solved... only noticed... [breathe]',
    'You can let the breath move at its own pace... [pause]',
    'Whatever is here is allowed to be here... [pause]',
    'There is no rush... no place else to get to... [breathe]',
    'Notice contact with the surface beneath you... [pause] ... support is already here.',
    'Let the face soften... the jaw unclench... [pause]',
    'Thoughts may come... they can move through... like weather... [pause]',
    'You might sense a little more space around the sensations... [breathe]',
    'No need to judge what you find... only to meet it gently... [pause]',
    'Rest in the part of you that is simply aware... [pause]',
    'If the mind wanders... that is natural... you can return without criticism... [pause]',
    'Each exhale can carry a small release... [breathe] ... each inhale a little room.',
    'You do not have to earn this pause... it is already offered... [pause]',
    'Let the belly be easy... the hands rest... [pause]',
    'Sound may arise nearby... you can let it pass through... [pause]',
    'There is nothing to force into clarity... clarity can emerge on its own... [breathe]',
    'Meet this moment with simple curiosity... [pause] ... not with fixing.',
    'If intensity appears... you can stay with it gently... or widen attention... your choice... [pause]',
    'The body knows how to breathe... you do not have to manage it perfectly... [pause]',
    'Notice if there is any grip... and see if it can loosen just a fraction... [breathe]',
    'This practice is not a test... there is no score... [pause]',
    'You might feel warmth... coolness... tingling... or nothing particular... all of it is okay... [pause]',
    'Let the next breath arrive when it arrives... [pause]',
    'There is room for everything that is here... [breathe]',
    'If you like... feel the weight of the body settling downward... [pause]',
    'The mind may want a story... you can let the story rest for now... [pause]',
    'Sense the space between sounds... between thoughts... [pause]',
    'Nothing has to change for you to be okay in this instant... [breathe]',
    'You can trust a slower tempo... [pause] ... the nervous system often likes slowness.',
    'If you notice planning... you can acknowledge it... and return to sensation... [pause]',
    'There is a quiet steadiness underneath the movement of thought... [pause]',
    'Let the eyes behind the eyelids be soft... [pause]',
    'Each moment is a fresh chance to begin again... [breathe]',
    'You might notice the edges of discomfort... without needing to push through... [pause]',
    'Compassion does not have to feel dramatic... it can be very simple... [pause]',
    'If you need to swallow or shift slightly... that is fine... [pause]',
    'The witness does not need to try... it is already present... [breathe]',
    'Let the heart area be unguarded... just for these minutes... [pause]',
    'There is wisdom in not forcing an answer... [pause]',
    'You can receive this time as a gift... not a task... [pause]',
    'Notice if there is kindness available toward yourself... even a little... [breathe]',
    'The world can wait... this time is for restoration... [pause]',
    'Whatever was urgent can soften its edges for now... [pause]',
    'Let listening widen... beyond the narrow point of worry... [pause]',
    'There is nothing you must become in this practice... [breathe]',
    'If sleepiness comes... you can allow heaviness... [pause]',
    'If alertness stays... you can allow wakefulness without chasing focus... [pause]',
    'The breath is a gentle tide... in... and out... [pause]',
    'You are allowed to be imperfect here... [breathe]',
    'Rest as awareness... not as effort... [pause]',
    'When you are ready... there will be time to re-engage... [pause] ... not yet... [breathe]',
];

export function padScriptTextToMinimumWords(
    scriptText: string,
    duration: 'short' | 'medium' | 'long'
): { text: string; padded: boolean; wordsBefore: number; wordsAfter: number } {
    const minWords = MEDITATION_DURATION_MIN_WORDS[duration];
    const wordsBefore = scriptText.split(/\s+/).filter(Boolean).length;
    if (wordsBefore >= minWords) {
        return { text: scriptText, padded: false, wordsBefore, wordsAfter: wordsBefore };
    }

    const extras: string[] = [];
    let words = wordsBefore;
    let i = 0;
    while (words < minWords && i < 3000) {
        const line = PAD_LINES[i % PAD_LINES.length];
        extras.push(line);
        words += line.split(/\s+/).filter(Boolean).length;
        i += 1;
    }

    const text = `${scriptText.trim()}\n\n${extras.join(' ')}`;
    const wordsAfter = text.split(/\s+/).filter(Boolean).length;
    return { text, padded: true, wordsBefore, wordsAfter };
}
