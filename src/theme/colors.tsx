import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { Text, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hawkins-inspired palette tuned for the Settle -> Notice -> Release -> Rest arc.
// Each hue carries a psychological intent (sage = safety, sand = groundedness, gold/peach = gentle humanity).
export const palette = {
  sand50: '#FAF7F2', // Warm sand = calm foundation without stark white
  sand100: '#F4F0E8', // Card background keeping screens easy on the eyes
  sand200: '#E8E2D8',
  stone800: '#2C2B28', // Stabilising stone = trustworthy body text
  stone600: '#6D6A62',

  sage400: '#A9CABB', // Sage communicates regulated calm
  sage600: '#6FA491', // Primary action color – courage without urgency
  teal700: '#3E7C75', // Deeper teal for emphasis/focus rings

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

  // Per-level luminous glow tokens (light mode - low opacity ≤0.20)
  glowShame: 'rgba(244, 114, 182, 0.20)',
  glowGuilt: 'rgba(251, 191, 36, 0.20)',
  glowApathy: 'rgba(56, 189, 248, 0.18)',
  glowGrief: 'rgba(94, 234, 212, 0.18)',
  glowFear: 'rgba(250, 204, 21, 0.20)',
  glowDesire: 'rgba(251, 146, 60, 0.20)',
  glowAnger: 'rgba(248, 113, 113, 0.20)',
  glowPride: 'rgba(167, 139, 250, 0.20)',
  glowCourage: 'rgba(52, 211, 153, 0.20)',
  glowNeutral: 'rgba(148, 163, 184, 0.16)',
  glowWilling: 'rgba(74, 222, 128, 0.20)',
  glowAccept: 'rgba(192, 132, 252, 0.20)',
  glowReason: 'rgba(96, 165, 250, 0.18)',
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
      background: palette.sage400,
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
  const background = isDark ? '#0E1F25' : '#EDEFF2'; // Light canvas in L* ~90 for airy glow
  const surface = isDark ? '#132A31' : palette.sand100; // Softer dark surface
  const cardBackground = isDark
    ? 'rgba(15, 28, 34, 0.72)'
    : palette.sand100;
  const appBackgroundGradient = isDark
    ? (['#0E1F25', '#16323B', '#1D4250'] as const) // Slate-teal night gradient (brighter)
    : ([
        '#E7ECF0', // Misty Slate top
        '#DCE4EB', // Balanced middle
        '#EAEFF3', // Soft base
      ] as const);
  const canvasOverlay = isDark ? 'rgba(7,16,24,0.35)' : 'rgba(255,255,255,0)';
  const border = isDark ? 'rgba(255,255,255,0.09)' : palette.sand200;
  const textPrimary = isDark ? palette.ice50 : palette.stone800;
  const textSecondary = isDark ? '#C8E0E2' : palette.stone600;
  const textMuted = isDark ? '#89A1A5' : '#8F8B82';
  const primary = isDark ? palette.teal500 : palette.sage600;
  const primarySubtle = isDark ? '#1F4F5A' : palette.sage400;
  const primaryContrast = isDark ? palette.night900 : '#FFFFFF';
  const accentTeal = isDark ? palette.teal500 : palette.teal700;
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
        hover: isDark ? '#72C0B3' : '#5D8E7C',
        shadow: isDark
          ? 'rgba(95, 181, 169, 0.35)'
          : 'rgba(111, 164, 145, 0.25)',
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
      settle: { background, accent: palette.sage400 },
      notice: { accent: palette.mist400 },
      release: { accent: primary },
      rest: { background: palette.night900, accent: palette.night700 },
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
  const renderChildrenSafely = React.useCallback(
    (node: React.ReactNode) =>
      React.Children.map(node, (child, index) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return (
            <Text key={`theme-child-${index}`}>{child}</Text>
          );
        }
        return child;
      }),
    []
  );
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
    <ThemeContext.Provider value={value}>
      {renderChildrenSafely(children)}
    </ThemeContext.Provider>
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
