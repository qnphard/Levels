import { useColorScheme } from 'react-native';

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
};

export const gradients = {
  horizonDay: ['#D7E6E8', '#BFD6C6', '#FAF7F2'],
  horizonEvening: ['#E5D3C4', '#BACFC8', '#F4F0E8'],
  horizonNight: ['#0F1C1F', '#112229', '#1C2D33'],
};

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
  shadowSoft: string;
  shadowMedium: string;
  white: string;
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
  const base = {
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
  const background = isDark ? palette.night900 : palette.sand50;
  const surface = isDark ? palette.night800 : palette.sand100;
  const cardBackground = isDark ? 'rgba(255,255,255,0.03)' : palette.sand100;
  const border = isDark ? 'rgba(255,255,255,0.07)' : palette.sand200;
  const textPrimary = isDark ? palette.ice50 : palette.stone800;
  const textSecondary = isDark ? palette.ice200 : palette.stone600;
  const textMuted = isDark ? '#7C9196' : '#8F8B82';
  const primary = isDark ? palette.teal500 : palette.sage600;
  const primarySubtle = isDark ? '#315A62' : palette.sage400;
  const primaryContrast = isDark ? palette.night900 : '#FFFFFF';
  const accentTeal = isDark ? palette.teal500 : palette.teal700;
  const highlightMist = isDark ? '#3A5560' : palette.mist400;
  const shadowSoft = isDark
    ? 'rgba(0,0,0,0.6)'
    : 'rgba(15, 28, 31, 0.08)';
  const shadowMedium = isDark
    ? 'rgba(0,0,0,0.45)'
    : 'rgba(15, 28, 31, 0.16)';

  return {
    mode,
    background,
    surface,
    cardBackground,
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
    accentGold: isDark ? '#C9B37F' : palette.gold300,
    shadowSoft,
    shadowMedium,
    white: isDark ? palette.ice50 : '#FFFFFF',
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
      warning: palette.warning500,
      danger: palette.danger500,
    },
  };
};

export const themes = {
  light: buildTheme('light'),
  dark: buildTheme('dark'),
};

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? themes.dark : themes.light;
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
