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
import { RootStackParamList } from '../navigation/types';
import { useThemeColors, spacing, typography } from '../theme/colors';
import { RoomBackground } from '../components/RoomBackground';
import { AtmosphereProvider, useAtmosphere } from '../context/AtmosphereContext';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function RoomOfLevelsContent() {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();
    const { zoomLevel, vignetteIntensity, lightingOpacity } = useAtmosphere();
    const scrollY = useRef(new Animated.Value(0)).current;

    const HEAVY_WEATHER_LEVELS = [
        { id: 'shame', label: 'Shame' },
        { id: 'guilt', label: 'Guilt' },
        { id: 'apathy', label: 'Apathy' },
        { id: 'grief', label: 'Grief' },
        { id: 'fear', label: 'Fear' },
        { id: 'desire', label: 'Desire' },
        { id: 'anger', label: 'Anger' },
        { id: 'pride', label: 'Pride' },
    ];

    const renderLevelNode = (item: { id: string, label: string }, index: number) => {
        const itemY = index * 200 + 100; // Vertical spacing

        // Distance Scaling: Farther nodes are smaller and more transparent
        const scale = scrollY.interpolate({
            inputRange: [itemY - 400, itemY, itemY + 400],
            outputRange: [0.6, 1.1, 0.6],
            extrapolate: 'clamp'
        });

        const opacity = scrollY.interpolate({
            inputRange: [itemY - 400, itemY, itemY + 400],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
        });

        const blur = scrollY.interpolate({
            inputRange: [itemY - 200, itemY, itemY + 200],
            outputRange: [5, 0, 5],
            extrapolate: 'clamp'
        });

        return (
            <Pressable
                key={item.id}
                onPress={() => navigation.navigate('LevelRoom', { levelId: item.id })}
                style={styles.nodeContainer}
            >
                <Animated.View style={[styles.hotspot, { transform: [{ scale }], opacity }]}>
                    <View style={styles.hotspotIconWrap}>
                        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'white', opacity: 0.1, borderRadius: 30 }]} />
                        <Ionicons name="cloud-outline" size={32} color="white" />
                    </View>
                    <Text style={styles.hotspotLabel}>{item.label}</Text>
                </Animated.View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Background Driven by Scroll */}
            <View style={StyleSheet.absoluteFill}>
                <RoomBackground
                    layers={{
                        far: require('../assets/images/default/light/far.png'),
                        mid: require('../assets/images/default/light/mid.png'),
                    }}
                    zoomLevel={zoomLevel}
                    scrollOffset={scrollY}
                />
            </View>

            {/* Atmosphere Effects */}
            <Animated.View style={[StyleSheet.absoluteFill, {
                backgroundColor: '#000',
                opacity: vignetteIntensity
            }]} pointerEvents="none" />

            <Animated.ScrollView
                style={StyleSheet.absoluteFill}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.roomTitle}>The Room of Levels</Text>
                    <Text style={styles.roomSubtitle}>Transmute dense energy into power</Text>
                </View>

                <View style={styles.journeyPath}>
                    {/* Vertical Connecting Line */}
                    <View style={styles.pathLine} />

                    {HEAVY_WEATHER_LEVELS.map((level, index) => renderLevelNode(level, index))}
                </View>

                <View style={{ height: 300 }} /> {/* End spacing */}
            </Animated.ScrollView>

            {/* Return Button */}
            <Pressable onPress={() => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                } else {
                    navigation.navigate('Main');
                }
            }} style={styles.closeBtn}>
                <Ionicons name="close" size={28} color="white" />
            </Pressable>
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
    scrollContent: { paddingTop: 120 },
    header: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        marginBottom: 80,
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
    journeyPath: {
        alignItems: 'center',
        position: 'relative',
    },
    pathLine: {
        position: 'absolute',
        width: 2,
        backgroundColor: 'rgba(255,255,255,0.15)',
        top: 0,
        bottom: 0,
        left: '50%',
        marginLeft: -1,
    },
    nodeContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hotspot: { alignItems: 'center', gap: spacing.sm },
    hotspotIconWrap: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
        backgroundColor: 'rgba(0,0,0,0.6)',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    hotspotLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowRadius: 6
    },
    closeBtn: { position: 'absolute', top: 50, left: 20, zIndex: 100 },
});
