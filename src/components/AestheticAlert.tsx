import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import {
    useThemeColors,
    spacing,
    borderRadius,
    typography,
    toRgba,
    palette,
} from '../theme/colors';

interface AestheticAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

const { width, height } = Dimensions.get('window');

export const AestheticAlert: React.FC<AestheticAlertProps> = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    isDestructive = true,
}) => {
    const theme = useThemeColors();
    const [showModal, setShowModal] = useState(visible);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.9))[0];

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowModal(false);
            });
        }
    }, [visible]);

    if (!showModal) return null;

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
                    <Animated.View
                        style={[
                            styles.backdrop,
                            {
                                opacity: fadeAnim,
                                backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
                            },
                        ]}
                    />
                </Pressable>

                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                            backgroundColor: theme.mode === 'dark' ? 'rgba(30, 32, 44, 0.85)' : '#FFFFFF',
                            borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0,0,0,0.05)',
                        },
                    ]}
                >
                    {theme.mode === 'dark' && (
                        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                    )}

                    <View style={styles.content}>
                        <View style={[
                            styles.iconWrapper,
                            { backgroundColor: isDestructive ? toRgba(theme.error || '#EF4444', 0.1) : toRgba(theme.primary, 0.1) }
                        ]}>
                            <Ionicons
                                name={isDestructive ? 'trash-outline' : 'alert-circle-outline'}
                                size={32}
                                color={isDestructive ? (theme.error || '#EF4444') : theme.primary}
                            />
                        </View>

                        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
                        <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}
                                onPress={onCancel}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.buttonText, { color: theme.textSecondary }]}>{cancelLabel}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.confirmButton,
                                    { backgroundColor: isDestructive ? (theme.error || '#EF4444') : theme.primary }
                                ]}
                                onPress={onConfirm}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.buttonText, styles.confirmButtonText]}>{confirmLabel}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        width: width * 0.85,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    content: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.h3,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        fontSize: typography.body,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.sm,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: 'transparent',
    },
    confirmButton: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#FFFFFF',
    },
});
