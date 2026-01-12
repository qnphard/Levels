import React, { useEffect, useMemo, memo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';
import { EssentialItem, getEssentialById } from '../data/essentials';
import { useUserStore } from '../store/userStore';
import PrimaryButton from './PrimaryButton';
import { successNotification, lightTap } from '../utils/haptics';

interface TopicPreviewSheetProps {
    visible: boolean;
    item: EssentialItem | null;
    onClose: () => void;
    onExplore: (item: EssentialItem) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65;

const TakeawaysList = memo(({ takeaways, theme }: { takeaways: string[], theme: any }) => (
    <View style={styles.takeawaysSection}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Key Takeaways</Text>
        {takeaways.map((point, index) => (
            <View key={index} style={styles.takeawayRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color={theme.primary} style={styles.checkIcon} />
                <Text style={[styles.takeawayText, { color: theme.textSecondary }]}>{point}</Text>
            </View>
        ))}
    </View>
));

const RelatedTopicsList = memo(({ related, theme, onExplore }: { related: string[], theme: any, onExplore: (item: EssentialItem) => void }) => (
    <View style={styles.relatedSection}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Related Topics</Text>
        <View style={styles.relatedChips}>
            {related.map((relId) => {
                const relItem = getEssentialById(relId);
                if (!relItem) return null;
                return (
                    <TouchableOpacity
                        key={relId}
                        style={[styles.chip, { backgroundColor: theme.categoryChips?.All?.background || theme.primarySubtle }]}
                        onPress={() => onExplore(relItem)}
                    >
                        <Text style={[styles.chipText, { color: theme.categoryChips?.All?.text || theme.primary }]}>{relItem.title}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
));

const TopicPreviewSheet: React.FC<TopicPreviewSheetProps> = ({
    visible,
    item,
    onClose,
    onExplore,
}) => {
    const theme = useThemeColors();
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const opacity = useSharedValue(0);

    const completedTopics = useUserStore((s) => s.completedTopics);
    const markTopicComplete = useUserStore((s) => s.markTopicComplete);
    const unmarkTopicComplete = useUserStore((s) => s.unmarkTopicComplete);
    const isCompleted = item ? completedTopics.includes(item.id) : false;

    useEffect(() => {
        if (visible) {
            // Use faster timing instead of physics-based spring
            translateY.value = withTiming(SCREEN_HEIGHT - SHEET_HEIGHT, { duration: 250 });
            opacity.value = withTiming(1, { duration: 200 });
        } else {
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 });
            opacity.value = withTiming(0, { duration: 150 });
        }
    }, [visible]);

    const gesture = Gesture.Pan()
        .activeOffsetY([-15, 15]) // Less sensitive
        .onUpdate((event) => {
            translateY.value = Math.max(SCREEN_HEIGHT - SHEET_HEIGHT, event.translationY + (SCREEN_HEIGHT - SHEET_HEIGHT));
        })
        .onEnd((event) => {
            if (event.velocityY > 500 || event.translationY > 100) {
                runOnJS(onClose)();
            } else {
                translateY.value = withTiming(SCREEN_HEIGHT - SHEET_HEIGHT, { duration: 200 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (!item && !visible) return null;

    return (
        <View style={styles.overlay} pointerEvents={visible ? 'auto' : 'none'}>
            <Animated.View style={[styles.backdrop, backdropStyle]}>
                <TouchableOpacity style={styles.flex1} onPress={onClose} activeOpacity={1} />
            </Animated.View>

            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.sheet,
                        { backgroundColor: theme.cardBackground },
                        animatedStyle,
                    ]}
                >
                    <View style={styles.handle} />

                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <View style={styles.header}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.primarySubtle }]}>
                                <Ionicons name={item?.icon || 'book-outline'} size={32} color={theme.primary} />
                            </View>
                            <View style={styles.titleContainer}>
                                <Text style={[styles.title, { color: theme.textPrimary }]}>{item?.title}</Text>
                                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Essential Knowledge</Text>
                            </View>
                        </View>

                        <Text style={[styles.description, { color: theme.textSecondary }]}>
                            {item?.description}
                        </Text>

                        {item?.takeaways && item.takeaways.length > 0 && (
                            <TakeawaysList takeaways={item.takeaways} theme={theme} />
                        )}

                        {item?.related && item.related.length > 0 && (
                            <RelatedTopicsList related={item.related} theme={theme} onExplore={onExplore} />
                        )}
                    </ScrollView>

                    <View style={[styles.footer, { borderTopColor: theme.border }]}>
                        {isCompleted ? (
                            <View style={styles.completedRow}>
                                <View style={styles.completedInfo}>
                                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                    <Text style={[styles.completedText, { color: theme.primary }]}>Completed</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item) {
                                            lightTap();
                                            unmarkTopicComplete(item.id);
                                        }
                                    }}
                                    style={styles.undoButton}
                                >
                                    <Text style={[styles.undoText, { color: theme.textSecondary }]}>Undo</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.markCompleteButton, { borderColor: theme.primary }]}
                                onPress={() => {
                                    if (item) {
                                        successNotification();
                                        markTopicComplete(item.id);
                                    }
                                }}
                            >
                                <Ionicons name="checkmark-circle-outline" size={20} color={theme.primary} />
                                <Text style={[styles.markCompleteText, { color: theme.primary }]}>Mark as Complete</Text>
                            </TouchableOpacity>
                        )}
                        <PrimaryButton
                            label="Begin Exploration"
                            onPress={() => item && onExplore(item)}
                        />
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    flex1: {
        flex: 1,
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: SHEET_HEIGHT,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        paddingTop: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.sm,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.h2,
        fontWeight: typography.bold,
    },
    subtitle: {
        fontSize: typography.small,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    description: {
        fontSize: typography.body,
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    takeawaysSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.h4,
        fontWeight: typography.bold,
        marginBottom: spacing.md,
    },
    takeawayRow: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
        alignItems: 'flex-start',
    },
    checkIcon: {
        marginRight: spacing.sm,
        marginTop: 2,
    },
    takeawayText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    relatedSection: {
        marginBottom: spacing.lg,
    },
    relatedChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing.xs,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        margin: spacing.xs,
    },
    chipText: {
        fontSize: 12,
        fontWeight: typography.semibold,
    },
    footer: {
        padding: spacing.lg,
        paddingBottom: (Platform.OS === 'ios' ? spacing.xl : spacing.lg) + 85, // Account for absolute tab bar (70px)
        borderTopWidth: 1,
        gap: spacing.sm,
    },
    completedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
    },
    completedInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    completedText: {
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },
    undoButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    undoText: {
        fontSize: typography.small,
        fontWeight: typography.semibold,
    },
    markCompleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.md,
        borderWidth: 1,
        borderRadius: borderRadius.md,
    },
    markCompleteText: {
        fontSize: typography.body,
        fontWeight: typography.semibold,
    },
});

export default memo(TopicPreviewSheet);
