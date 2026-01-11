import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeColors, spacing, typography, borderRadius } from '../theme/colors';

const { height } = Dimensions.get('window');

interface FeatureExplanationOverlayProps {
    visible: boolean;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    onClose: () => void;
}

const FeatureExplanationOverlay: React.FC<FeatureExplanationOverlayProps> = ({
    visible,
    title,
    description,
    icon,
    onClose,
}) => {
    const theme = useThemeColors();
    const translateY = React.useRef(new Animated.Value(height)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.backdrop, { opacity }]}>
                    <TouchableOpacity
                        style={styles.backdropPressable}
                        activeOpacity={1}
                        onPress={onClose}
                    >
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ translateY }],
                            backgroundColor: theme.surface
                        }
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                        <Ionicons name={icon} size={40} color={theme.primary} />
                    </View>

                    <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.buttonText, { color: theme.primaryContrast }]}>Got it</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    backdropPressable: {
        flex: 1,
    },
    container: {
        borderTopLeftRadius: borderRadius.xxl,
        borderTopRightRadius: borderRadius.xxl,
        padding: spacing.xl,
        paddingBottom: spacing.xxl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.h2,
        fontWeight: typography.bold,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    description: {
        fontSize: typography.body,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    button: {
        width: '100%',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: typography.body,
        fontWeight: typography.bold,
    },
});

export default FeatureExplanationOverlay;
