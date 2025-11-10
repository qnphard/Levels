import { useMemo } from 'react';
import { useThemeColors } from '../../../theme/colors';

/**
 * Hook to get theme-aware animation colors
 */
export function useThemeAnimation() {
  const theme = useThemeColors();

  const colors = useMemo(() => {
    const isDark = theme.mode === 'dark';
    
    return {
      // Primary colors
      primary: theme.primary,
      primaryLight: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.1)',
      primaryDark: isDark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.6)',
      
      // Background colors
      background: theme.appBackgroundGradient[0],
      backgroundSecondary: theme.cardBackground,
      
      // Text colors
      text: theme.textPrimary,
      textSecondary: theme.textSecondary,
      
      // Energy/emotion colors
      energy: isDark ? '#34D399' : '#10B981', // Green for energy
      energyLeak: isDark ? '#F87171' : '#EF4444', // Red for energy leak
      fear: isDark ? '#F59E0B' : '#D97706', // Orange for fear
      love: isDark ? '#F472B6' : '#EC4899', // Pink for love
      power: isDark ? '#60A5FA' : '#3B82F6', // Blue for power
      force: isDark ? '#F87171' : '#EF4444', // Red for force
      
      // Sky/cloud colors
      sky: isDark ? '#1E293B' : '#E0F2FE',
      skyBright: isDark ? '#334155' : '#BAE6FD',
      sun: '#FCD34D',
      cloud: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      cloudDark: isDark ? 'rgba(100, 100, 100, 0.8)' : 'rgba(150, 150, 150, 0.7)',
      
      // Shadow/illumination
      shadow: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)',
      light: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)',
      
      // Black hole
      blackHole: isDark ? '#000000' : '#1F2937',
      blackHoleAccretion: isDark ? '#4B5563' : '#6B7280',
    };
  }, [theme]);

  return colors;
}



