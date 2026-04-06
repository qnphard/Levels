import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { EssentialItem } from '../data/essentials';
import { useThemeColors, ThemeColors, toRgba } from '../theme/colors';

interface StartHereCardProps {
    foundationItems: EssentialItem[];
    onItemPress: (item: EssentialItem) => void;
    onInfoPress?: () => void;
}

const StartHereCard: React.FC<StartHereCardProps> = ({
    foundationItems,
    onItemPress,
    onInfoPress,
}) => {
    const theme = useThemeColors();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const iconColors = [theme.accentTeal, theme.primary, theme.accentGold];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Ionicons name="star" size={14} color={theme.accentGold} />
                    <Text style={styles.headerTitle}>Start Here</Text>
                </View>
                {onInfoPress && (
                    <TouchableOpacity onPress={onInfoPress} style={styles.infoButton}>
                        <Ionicons name="information-circle-outline" size={20} color={theme.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.subtitle}>
                If you only do one thing: start here.
            </Text>

            <View style={styles.pillsContainer}>
                {foundationItems.slice(0, 3).map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.pill}
                        onPress={() => onItemPress(item)}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={[
                                theme.mode === 'dark' ? 'rgba(30, 40, 60, 0.9)' : toRgba(theme.surfaceCard, 0.95),
                                theme.mode === 'dark' ? 'rgba(20, 30, 50, 0.95)' : toRgba(theme.cardBackground, 0.98),
                            ]}
                            style={styles.pillGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons
                                name={item.icon || 'ellipse'}
                                size={18}
                                color={iconColors[index % iconColors.length]}
                                style={styles.pillIcon}
                            />
                            <Text style={styles.pillText} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={theme.textMuted}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const createStyles = (theme: ThemeColors) =>
    StyleSheet.create({
        container: {
            marginHorizontal: 16,
            marginTop: 8,
            marginBottom: 16,
            backgroundColor:
                theme.mode === 'dark' ? 'rgba(20, 30, 50, 0.8)' : theme.surfaceCard,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.borderCard,
            shadowColor: theme.accentTeal,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.mode === 'dark' ? 0.2 : 0.12,
            shadowRadius: 16,
            elevation: 8,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: theme.textPrimary,
            marginLeft: 6,
            letterSpacing: 0.5,
        },
        infoButton: {
            padding: 4,
        },
        subtitle: {
            fontSize: 13,
            color: theme.textMuted,
            marginBottom: 14,
            fontStyle: 'italic',
        },
        pillsContainer: {
            gap: 10,
        },
        pill: {
            borderRadius: 14,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.borderSubtle,
        },
        pillGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
        },
        pillIcon: {
            marginRight: 12,
        },
        pillText: {
            flex: 1,
            fontSize: 14,
            fontWeight: '600',
            color: theme.textPrimary,
        },
    });

export default StartHereCard;
