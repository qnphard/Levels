import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Palette tuned for the Settle -> Notice -> Release -> Rest arc.
// Each hue carries a psychological intent (sage = safety, sand = groundedness, gold/peach = gentle humanity).
export const palette = {
  sand50: '#FAF7F2', // Warm sand = calm foundation without stark white
  sand100: '#F4F0E8', // Card background keeping screens easy on the eyes
  sand200: '#E8E2D8',
  stone800: '#2C2B28', // Stabilising stone = trustworthy body text
  stone600: '#6D6A62',

  sage400: '#A9CABB', // Sage communicates regulated calm (kept for compatibility)
  sage600: '#6FA491', // Old primary - kept for reference
  teal700: '#3E7C75', // Deeper teal for emphasis/focus rings
  
  // Purple/Violet palette for primary theme
  violet300: '#C4B5FD', // Soft lavender for light theme subtle backgrounds
  violet400: '#A78BFA', // Bright purple for dark theme primary
  violet500: '#8B5CF6', // Medium violet for accents
  violet600: '#7C3AED', // Deep purple for light theme primary
  violet700: '#6D28D9', // Deep violet for dark theme subtle backgrounds

  mist400: '#B8D7E4', // Mist brings gentle clarity (Notice stage)
  mist700: '#2E5D6A',

  peach300: '#F3D7C6', // Warm humanity / friendliness
  peach200: '#D7BFA5',
  gold300: '#E6CFA8', // Quiet optimism

  success500: '#72A880',
  warning500: '#E6C279',
  danger500: '#C26B6B',

  night900: '#0F1C1F',
  night800: '#15272B',
  night700: '#1C2D33',

  ice50: '#E8F1F2',
  ice200: '#B7C7C9',

  teal500: '#5FB5A9',

  // Bioluminescent glow colors
  bioGlow: '#5FB5A9', // Primary bioluminescent teal
  bioCore: '#8BE9FD', // Bright cyan core
  bioPulse: 'rgba(95, 181, 169, 0.4)', // Pulsing outer glow
};

export const gradients = {
  horizonDay: ['#D7E6E8', '#BFD6C6', '#FAF7F2'],
  horizonEvening: ['#E5D3C4', '#BACFC8', '#F4F0E8'],
  horizonNight: ['#0F1C1F', '#112229', '#1C2D33'],
} as const;

export type CategoryChipName =
  | 'All'
  | 'Find Peace'
  | 'Let Go'
  | 'Discover Joy'
  | 'Be Present'
  | 'Rest Deeply';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  mode: ThemeMode;
  background: string;
  surface: string;
  cardBackground: string;
  appBackgroundGradient: readonly [string, string, string];
  canvasOverlay: string;
  elevatedCard: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;
  headingOnGradient: string;
  primary: string;
  primarySubtle: string;
  primaryContrast: string;
  accentTeal: string;
  highlightMist: string;
  deepMist: string;
  accentPeach: string;
  accentGold: string;
  gold: string;
  shadowSoft: string;
  shadowMedium: string;
  white: string;
  warning: string;
  warningSubtle: string;
  error: string;
  bioluminescence: {
    glow: string;
    core: string;
    pulse: string;
  };
  buttons: {
    primary: {
      background: string;
      text: string;
      focus: string;
      hover: string;
      shadow: string;
    };
    secondary: {
      background: string;
      text: string;
      border: string;
      hover: string;
    };
  };
  categoryChips: Record<
    CategoryChipName,
    { background: string; text: string; border?: string }
  >;
  experience: {
    settle: { background: string; accent: string };
    notice: { accent: string };
    release: { accent: string };
    rest: { background: string; accent: string };
  };
  feelingsChapters: {
    rose: string;
    violet: string;
    amber: string;
    teal: string;
    sky: string;
  };
  gradients: typeof gradients;
  states: {
    success: string;
    warning: string;
    danger: string;
  };
}

const sharedCategoryChips = (mode: ThemeMode) => {
  const base: Record<
    CategoryChipName,
    { background: string; text: string; border?: string }
  > = {
    All: {
      background: 'transparent',
      text: palette.stone600,
      border: palette.sand200,
    },
    'Find Peace': {
      background: palette.violet300, // Updated to violet
      text: palette.stone800,
    },
    'Let Go': {
      background: palette.mist400,
      text: palette.stone800,
    },
    'Discover Joy': {
      background: palette.gold300,
      text: palette.stone800,
    },
    'Be Present': {
      background: palette.sand200,
      text: palette.stone600,
    },
    'Rest Deeply': {
      background: palette.teal700,
      text: palette.ice50,
    },
  };

  if (mode === 'dark') {
    base.All = {
      background: 'transparent',
      text: palette.ice200,
      border: 'rgba(255,255,255,0.06)',
    };
    base['Be Present'] = {
      background: 'transparent',
      text: palette.ice200,
      border: 'rgba(255,255,255,0.06)',
    };
    base['Rest Deeply'] = {
      background: palette.night800,
      text: palette.ice50,
      border: 'rgba(255,255,255,0.08)',
    };
  }

  return base;
};

const buildTheme = (mode: ThemeMode): ThemeColors => {
  const isDark = mode === 'dark';
  // Enhanced dark theme with deeper cosmic tones
  const background = isDark ? '#0f172a' : '#F6F7FB';
  const surface = isDark ? '#1e293b' : 'rgba(255,255,255,0.72)';
  const cardBackground = isDark
    ? 'rgba(30, 41, 59, 0.65)'
    : 'rgba(255,255,255,0.78)';
  const appBackgroundGradient = isDark
    ? (['#0f172a', '#1e293b', '#334155'] as const)
    : (['#F6F7FB', '#FBFAFE', '#F9F6F8'] as const);
  const canvasOverlay = isDark ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.5)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)';
  const textPrimary = isDark ? palette.ice50 : palette.stone800;
  const textSecondary = isDark ? '#C8E0E2' : palette.stone600;
  const textMuted = isDark ? '#89A1A5' : '#8F8B82';
  // Updated to violet theme: bright for dark mode, deep for light mode
  const primary = isDark ? palette.violet400 : palette.violet600;
  const primarySubtle = isDark ? palette.violet700 : palette.violet300;
  const primaryContrast = isDark ? palette.night900 : '#FFFFFF';
  const accentTeal = isDark ? palette.violet500 : palette.violet500; // Now violet accent
  const highlightMist = isDark ? '#2B4652' : palette.mist400;
  const shadowSoft = isDark
    ? 'rgba(0,0,0,0.65)'
    : 'rgba(15, 28, 31, 0.08)';
  const shadowMedium = isDark
    ? 'rgba(0,0,0,0.52)'
    : 'rgba(15, 28, 31, 0.16)';
  const gold = isDark ? '#C9B37F' : palette.gold300;
  const warning = palette.warning500;
  const warningSubtle = isDark ? 'rgba(230,194,121,0.18)' : 'rgba(230,194,121,0.32)';
  const error = palette.danger500;

  // Bioluminescent colors for ripple effects
  const bioluminescence = {
    glow: isDark ? palette.bioGlow : palette.sage600,
    core: isDark ? palette.bioCore : palette.sage400,
    pulse: isDark ? 'rgba(95, 181, 169, 0.4)' : 'rgba(111, 164, 145, 0.3)',
  };

  return {
    mode,
    background,
    surface,
    cardBackground,
    appBackgroundGradient,
    canvasOverlay,
    elevatedCard: isDark ? 'rgba(255,255,255,0.08)' : palette.sand100,
    border,
    textPrimary,
    textSecondary,
    textMuted,
    textLight: isDark ? palette.ice50 : '#FFFFFF',
    headingOnGradient: isDark ? palette.ice50 : palette.ice50,
    primary,
    primarySubtle,
    primaryContrast,
    accentTeal,
    highlightMist,
    deepMist: isDark ? palette.night800 : palette.mist700,
    accentPeach: isDark ? palette.peach200 : palette.peach300,
    accentGold: gold,
    gold,
    shadowSoft,
    shadowMedium,
    white: isDark ? palette.ice50 : '#FFFFFF',
    warning,
    warningSubtle,
    error,
    bioluminescence,
    buttons: {
      primary: {
        background: primary,
        text: primaryContrast,
        focus: accentTeal,
        hover: isDark ? '#C4B5FD' : '#6D28D9', // Violet hover states
        shadow: isDark
          ? 'rgba(139, 92, 246, 0.35)'
          : 'rgba(124, 58, 237, 0.25)', // Violet shadows
      },
      secondary: {
        background: surface,
        text: textSecondary,
        border,
        hover: isDark ? 'rgba(255,255,255,0.06)' : '#E2DACF',
      },
    },
    categoryChips: sharedCategoryChips(mode),
    experience: {
      settle: { background, accent: palette.violet300 }, // Updated to violet
      notice: { accent: palette.mist400 },
      release: { accent: primary },
      rest: { background: palette.night900, accent: palette.night700 },
    },
    feelingsChapters: {
      rose: '#F472B6', // Suppression - rose pink
      violet: '#A78BFA', // Repression - violet purple
      amber: '#FBBF24', // Expression - amber gold
      teal: '#5FB5A9', // Escape - teal cyan
      sky: '#60A5FA', // Stress - sky blue
    },
    gradients,
    states: {
      success: palette.success500,
      warning,
      danger: palette.danger500,
    },
  };
};

export const themes = {
  light: buildTheme('light'),
  dark: buildTheme('dark'),
};

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  glowEnabled: boolean;
  toggleGlow: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemScheme = useColorScheme();
  const initialMode = systemScheme === 'dark' ? 'dark' : 'light';
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [glowEnabled, setGlowEnabled] = useState<boolean>(true);

  const colors = useMemo(() => themes[mode], [mode]);

  // Persisted preference for card glow (default: on)
  const GLOW_STORAGE_KEY = '@meditation_app:glow_enabled';
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(GLOW_STORAGE_KEY);
        if (stored === '0' || stored === 'false') setGlowEnabled(false);
      } catch {}
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((nextMode: ThemeMode) => {
    setMode(nextMode);
  }, []);

  const toggleGlow = useCallback(() => {
    setGlowEnabled((prev) => {
      const next = !prev;
      AsyncStorage.setItem(GLOW_STORAGE_KEY, next ? '1' : '0').catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      colors,
      toggleTheme,
      setTheme,
      glowEnabled,
      toggleGlow,
    }),
    [mode, colors, toggleTheme, setTheme, glowEnabled, toggleGlow]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeColors = (): ThemeColors => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return themes.light;
  }
  return ctx.colors;
};

export const useThemeMode = (): ThemeMode => {
  const ctx = useContext(ThemeContext);
  return ctx?.mode ?? 'light';
};

export const useThemeToggle = (): (() => void) => {
  const ctx = useContext(ThemeContext);
  return ctx?.toggleTheme ?? (() => {});
};

export const useSetTheme = (): ((mode: ThemeMode) => void) => {
  const ctx = useContext(ThemeContext);
  return ctx?.setTheme ?? (() => {});
};

export const useGlowEnabled = (): boolean => {
  const ctx = useContext(ThemeContext);
  return ctx?.glowEnabled ?? true;
};

export const useGlowToggle = (): (() => void) => {
  const ctx = useContext(ThemeContext);
  return ctx?.toggleGlow ?? (() => {});
};

export const typography = {
  headerFont: 'System',
  bodyFont: 'System',
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 16,
  small: 14,
  tiny: 12,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  lineHeight: 1.6,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  roundedChip: 24,
  round: 999,
};
