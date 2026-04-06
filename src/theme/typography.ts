import { Platform, TextStyle } from 'react-native';

const systemFont = Platform.select({
    ios: 'System',
    android: 'Roboto',
});

// Editorial Typography System
// Designed for "Breathability" and "Locked-in" titles.

export const typography = {
    fonts: {
        primary: systemFont,
        display: systemFont, // Could be a Serif if added later
    },

    weights: {
        thin: '300',
        regular: '400',
        medium: '500',
        bold: '700',
        heavy: '800', // For Display Titles
    },

    // Golden Ratio Scale (approx)
    sizes: {
        display: 48,
        h1: 32,
        h2: 24,
        h3: 20,
        bodyLarge: 18,
        body: 16,
        caption: 14,
        small: 12,
        /** Extra-small labels, badges */
        tiny: 10,
    },

    // Editorial Spacing
    lineHeights: {
        display: 56, // 1.16x (Tight)
        h1: 40,      // 1.25x
        h2: 32,      // 1.33x
        body: 28,    // 1.75x (Very breathable)
        caption: 22, // 1.57x
    },

    // Tracking (Letter Spacing)
    tracking: {
        tighter: -0.8, // For Display
        tight: -0.5,   // For H1/H2
        normal: 0,
        wide: 0.5,     // For Body
        widest: 1.5,   // For Uppercase Captions / Eyebrows
    },

    // Presets
    styles: {
        display: {
            fontSize: 48,
            lineHeight: 56,
            letterSpacing: -0.8,
            fontWeight: '800',
        } as TextStyle,
        h1: {
            fontSize: 32,
            lineHeight: 40,
            letterSpacing: -0.5,
            fontWeight: '700',
        } as TextStyle,
        h2: {
            fontSize: 24,
            lineHeight: 32,
            letterSpacing: -0.3,
            fontWeight: '600',
        } as TextStyle,
        h3: {
            fontSize: 20,
            lineHeight: 28,
            letterSpacing: -0.2,
            fontWeight: '600',
        } as TextStyle,
        body: {
            fontSize: 16,
            lineHeight: 28, // Breathable
            letterSpacing: 0.3,
            fontWeight: '400',
        } as TextStyle,
        eyebrow: {
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 1.5,
            fontWeight: '600',
            textTransform: 'uppercase',
        } as TextStyle,
    }
};
