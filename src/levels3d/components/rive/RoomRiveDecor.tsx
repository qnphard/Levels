import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/** Full-screen dusk room backdrop (under Rive). */
export function RoomBackdrop() {
    return (
        <LinearGradient
            colors={['#0f172a', '#1e1b4b', '#312e81', '#4c1d4f', '#7c2d12']}
            locations={[0, 0.28, 0.52, 0.78, 1]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFill}
        />
    );
}

/** Light vignette so labels stay readable without hiding the Rive scene. */
export function RoomVignette() {
    return (
        <LinearGradient
            colors={[
                'rgba(0,0,0,0.08)',
                'rgba(0,0,0,0.02)',
                'rgba(0,0,0,0.03)',
                'rgba(8,6,18,0.16)',
            ]}
            locations={[0, 0.25, 0.65, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
        />
    );
}
