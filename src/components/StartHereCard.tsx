import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { EssentialItem } from '../data/essentials';

const { width } = Dimensions.get('window');

// Premium colors
const COLORS = {
    teal: '#14b8a6',
    tealDark: '#0d9488',
    purple: '#a855f7',
    gold: '#fbbf24',
    textLight: '#e0f2fe',
    textMuted: '#94a3b8',
    cardBg: 'rgba(20, 30, 50, 0.8)',
    border: 'rgba(255, 255, 255, 0.12)',
};

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
    const iconColors = [COLORS.teal, COLORS.purple, COLORS.gold];

    return (
        <View style={styles.container}>
            {/* Header row */}
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Ionicons name="star" size={14} color={COLORS.gold} />
                    <Text style={styles.headerTitle}>Start Here</Text>
                </View>
                {onInfoPress && (
                    <TouchableOpacity onPress={onInfoPress} style={styles.infoButton}>
                        <Ionicons name="information-circle-outline" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                If you only do one thing: start here.
            </Text>

            {/* Foundation pills */}
            <View style={styles.pillsContainer}>
                {foundationItems.slice(0, 3).map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.pill}
                        onPress={() => onItemPress(item)}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['rgba(30, 40, 60, 0.9)', 'rgba(20, 30, 50, 0.95)']}
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
                                color={COLORS.textMuted}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        backgroundColor: COLORS.cardBg,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        // Subtle glow
        shadowColor: COLORS.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
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
        color: COLORS.textLight,
        marginLeft: 6,
        letterSpacing: 0.5,
    },
    infoButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.textMuted,
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
        borderColor: 'rgba(255, 255, 255, 0.08)',
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
        color: COLORS.textLight,
    },
});

export default StartHereCard;
