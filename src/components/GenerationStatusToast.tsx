import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMeditationGenerationStore } from '../store/meditationGenerationStore';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

export default function GenerationStatusToast() {
    const { isGenerating, progress, error, playResult, reset, progressValue } = useMeditationGenerationStore();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    if (!isGenerating && progress === 'idle') return null;

    const handlePress = async () => {
        if (progress === 'completed') {
            await playResult();
            reset();
        } else if (progress === 'error') {
            reset();
        }
    };

    const getStatusText = () => {
        switch (progress) {
            case 'brewing_script': return `Planning Session (${progressValue}%)`;
            case 'synthesizing_audio': return `Synthesizing Voice (${progressValue}%)`;
            case 'completed': return 'Meditation Ready! Tap to Play';
            case 'error': return 'Generation Failed';
            default: return '';
        }
    };

    const getIcon = () => {
        if (progress === 'error') return 'warning';
        if (progress === 'completed') return 'play-circle';
        return null;
    };

    return (
        <View style={[styles.container, { top: insets.top + 10 }]}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePress}
                disabled={progress === 'brewing_script' || progress === 'synthesizing_audio'}
            >
                <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                    <View style={styles.content}>

                        {getIcon() ? (
                            <Ionicons name={getIcon() as any} size={24} color={progress === 'error' ? '#ef4444' : '#10b981'} style={styles.icon} />
                        ) : (
                            <ActivityIndicator color="#6366f1" size="small" style={styles.spinner} />
                        )}

                        <View style={styles.textContainer}>
                            <Text style={styles.statusText}>{getStatusText()}</Text>
                            {progress === 'error' ? (
                                <Text style={styles.errorText} numberOfLines={4}>
                                    {error}
                                </Text>
                            ) : (
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${progressValue}%` }]} />
                                </View>
                            )}
                        </View>

                        {progress === 'completed' && (
                            <TouchableOpacity onPress={reset} style={styles.closeButton}>
                                <Ionicons name="close" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </BlurView>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: 'center',
    },
    blurContainer: {
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        width: '100%',
    },
    spinner: {
        marginRight: 12,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 2,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    }
});
