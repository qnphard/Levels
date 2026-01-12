/**
 * Central registry for local meditation audio assets.
 * Expo/React Native requires static require() calls for local assets.
 */
export const audioMap: Record<string, any> = {
    'breath_awareness': require('../assets/audio/breath_awareness.mp3'),
    'body_scan': require('../assets/audio/body_scan.mp3'),
    'safe_space': require('../assets/audio/safe_space.mp3'),
    'releasing_tension': require('../assets/audio/releasing_tension.mp3'),
    'letting_thoughts_pass': require('../assets/audio/letting_thoughts_pass.mp3'),
    'softening_practice': require('../assets/audio/softening_practice.mp3'),
    'gratitude_meditation': require('../assets/audio/gratitude_meditation.mp3'),
    'loving_kindness': require('../assets/audio/loving_kindness.mp3'),
    'morning_centering': require('../assets/audio/morning_centering.mp3'),
    'stillness_practice': require('../assets/audio/stillness_practice.mp3'),
    'evening_wind_down': require('../assets/audio/evening_wind_down.mp3'),
    'sleep_body_scan': require('../assets/audio/sleep_body_scan.mp3'),
    'deep_rest': require('../assets/audio/deep_rest.mp3'),
    'between_tasks': require('../assets/audio/between_tasks.mp3'),
    'meeting_resistance': require('../assets/audio/meeting_resistance.mp3'),
    'middle_of_the_night': require('../assets/audio/middle_of_the_night.mp3'),
    'reset_after_overwhelm': require('../assets/audio/reset_after_overwhelm.mp3'),
    'rest_without_sleep': require('../assets/audio/rest_without_sleep.mp3'),
    'returning_to_daily_life': require('../assets/audio/returning_to_daily_life.mp3'),
    'staying_with_discomfort': require('../assets/audio/staying_with_discomfort.mp3'),
};

/**
 * Resolves an audio URL or local asset key.
 * If the string matches a key in audioMap, it returns the local require().
 * Otherwise, it returns the string as a remote URL.
 */
export const resolveAudioSource = (url: string) => {
    if (audioMap[url]) {
        return audioMap[url];
    }
    return { uri: url };
};
