import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Platform,
    Animated,
    StatusBar,
    BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useThemeColors, spacing, typography } from '../theme/colors';
import { RoomBackground } from '../components/RoomBackground';
import { AtmosphereProvider, useAtmosphere } from '../context/AtmosphereContext';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function RoomOfLevelsContent() {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();
    const { zoomLevel, vignetteIntensity, lightingOpacity } = useAtmosphere();

    const hubOpacity = useRef(new Animated.Value(1)).current;

    const renderHotspot = (levelId: string, icon: keyof typeof Ionicons.glyphMap, top: number, align: 'left' | 'right' | 'center', label: string) => {
        const positionStyle: any = { top: `${top}%` };

        if (align === 'center') {
            positionStyle.left = '50%';
            positionStyle.transform = [{ translateX: -30 }];
        } else if (align === 'left') {
            positionStyle.left = '18%';
        } else if (align === 'right') {
            positionStyle.right = '18%';
        }

        return (
            <Pressable
                key={levelId}
                onPress={() => navigation.navigate('LevelRoom', { levelId })}
                style={[styles.hotspot, positionStyle]}
            >
                <View style={styles.hotspotIconWrap}>
                    <Ionicons name={icon} size={28} color="white" />
                </View>
                <Text style={styles.hotspotLabel}>{label}</Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Background */}
            <View style={StyleSheet.absoluteFill}>
                <RoomBackground
                    layers={{
                        far: require('../assets/images/default/far.png'),
                        mid: require('../assets/images/default/mid.png'),
                        fg: undefined as any,
                    }}
                    zoomLevel={zoomLevel}
                />
            </View>

            {/* Atmosphere Effects */}
            <Animated.View style={[StyleSheet.absoluteFill, {
                backgroundColor: '#000',
                opacity: vignetteIntensity
            }]} pointerEvents="none" />

            <Animated.View style={[StyleSheet.absoluteFill, { opacity: Animated.multiply(lightingOpacity, 0.4) }]} pointerEvents="none">
                <LinearGradient
                    colors={['rgba(75, 29, 63, 0.4)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Hub Overlay */}
            <Animated.View style={[styles.layerContainer, { opacity: hubOpacity }]}>
                <View style={styles.header}>
                    <Text style={styles.roomTitle}>The Room of Levels</Text>
                    <Text style={styles.roomSubtitle}>Transmute dense energy into power</Text>
                </View>

                <View style={styles.hotspotsLayer}>
                    {renderHotspot('shame', 'cloud-outline', 25, 'center', 'Shame')}
                    {renderHotspot('guilt', 'cloud-outline', 45, 'left', 'Guilt')}
                    {renderHotspot('apathy', 'cloud-outline', 45, 'right', 'Apathy')}
                    {renderHotspot('grief', 'cloud-outline', 65, 'center', 'Grief')}
                </View>

                {/* Return Button */}
                <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color="white" />
                </Pressable>
            </Animated.View>
        </View>
    );
}

export default function RoomOfLevelsScreen() {
    return (
        <AtmosphereProvider>
            <RoomOfLevelsContent />
        </AtmosphereProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    layerContainer: { ...StyleSheet.absoluteFillObject },
    header: {
        marginTop: 80,
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    roomTitle: {
        color: 'white',
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 10,
    },
    roomSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '300',
    },
    hotspotsLayer: { flex: 1 },
    hotspot: { position: 'absolute', alignItems: 'center', gap: spacing.xs, width: 60 },
    hotspotIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    hotspotLabel: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowRadius: 6
    },
    closeBtn: { position: 'absolute', top: 50, left: 20, zIndex: 100 },
});
