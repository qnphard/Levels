import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Pressable,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Premium colors
const COLORS = {
    teal: '#14b8a6',
    purple: '#a855f7',
    gold: '#fbbf24',
    textLight: '#e0f2fe',
    textMuted: '#94a3b8',
    border: 'rgba(255, 255, 255, 0.1)',
};

interface HowToUseModalProps {
    visible: boolean;
    onClose: () => void;
}

interface BulletPoint {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    color: string;
}

const bullets: BulletPoint[] = [
    {
        icon: 'leaf-outline',
        text: 'Start with Foundations.',
        color: COLORS.teal,
    },
    {
        icon: 'git-branch-outline',
        text: 'A suggested path is available, but jumping around is okay.',
        color: COLORS.purple,
    },
    {
        icon: 'refresh-outline',
        text: 'If you feel overwhelmed, return to Letting Go Basics.',
        color: COLORS.gold,
    },
    {
        icon: 'time-outline',
        text: 'Take your time. Practice one thing for 1–3 days before moving on.',
        color: COLORS.teal,
    },
];

const HowToUseModal: React.FC<HowToUseModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                        <LinearGradient
                            colors={['rgba(20, 25, 50, 0.98)', 'rgba(15, 20, 40, 0.99)']}
                            style={styles.cardGradient}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <Ionicons name="help-circle" size={24} color={COLORS.teal} />
                                <Text style={styles.title}>How to use this app</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color={COLORS.textMuted} />
                                </TouchableOpacity>
                            </View>

                            {/* Bullets */}
                            <View style={styles.bulletsContainer}>
                                {bullets.map((bullet, index) => (
                                    <View key={index} style={styles.bulletRow}>
                                        <View style={[styles.bulletIcon, { shadowColor: bullet.color }]}>
                                            <Ionicons name={bullet.icon} size={18} color={bullet.color} />
                                        </View>
                                        <Text style={styles.bulletText}>{bullet.text}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Footer note */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    This is a gentle map for inner clarity.{'\n'}
                                    No rush. No pressure. Just awareness.
                                </Text>
                            </View>

                            {/* Close button */}
                            <TouchableOpacity
                                style={styles.gotItButton}
                                onPress={onClose}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.gotItText}>Got it</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Pressable>
                </Pressable>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    blurContainer: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    card: {
        width: width * 0.9,
        maxWidth: 400,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.teal,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 16,
    },
    cardGradient: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textLight,
        marginLeft: 12,
    },
    closeButton: {
        padding: 4,
    },
    bulletsContainer: {
        gap: 16,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bulletIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.textLight,
    },
    footer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    footerText: {
        fontSize: 13,
        lineHeight: 20,
        color: COLORS.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    gotItButton: {
        marginTop: 20,
        backgroundColor: COLORS.teal,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    gotItText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});

export default HowToUseModal;
