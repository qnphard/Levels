import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AtmosphereProvider, useAtmosphere } from '../context/AtmosphereContext';
import { AtmosphereDepthProvider, useAtmosphereDepth } from '../context/AtmosphereDepthContext';

import BreadcrumbBar from './BreadcrumbBar';

/**
 * AtmosphereOverlay
 * Wraps the entire app (or a navigation stack) and provides a persistent
 * atmospheric background (gradient, particles, vignette) that adapts to the
 * current navigation depth.
 */
export const AtmosphereOverlay = ({ children }: { children: ReactNode }) => {
    return (
        <AtmosphereProvider>
            <AtmosphereDepthProvider>
                <AtmosphereOverlayInner>{children}</AtmosphereOverlayInner>
            </AtmosphereDepthProvider>
        </AtmosphereProvider>
    );
};

const AtmosphereOverlayInner = ({ children }: { children: ReactNode }) => {
    const { vignetteIntensity } = useAtmosphere();
    const { currentDepth } = useAtmosphereDepth();

    // Adjust visual intensity based on depth (deeper = darker)
    const depthFactor = Math.min(currentDepth / 5, 1);

    return (
        <View style={styles.container}>
            {/* Deep space gradient background - only when deeply nested */}
            {currentDepth > 0 ? (
                <LinearGradient
                    colors={['#0a0a1a', '#1a1a2e', '#16213e', '#0f0f23']}
                    locations={[0, 0.3, 0.7, 1]}
                    style={StyleSheet.absoluteFill}
                />
            ) : null}

            {/* Vignette overlay that darkens with depth */}
            <Animated.View
                style={[
                    styles.vignette,
                    {
                        opacity: Animated.multiply(vignetteIntensity, (0.4 + depthFactor * 0.4)),
                    },
                ]}
                pointerEvents="none"
            />

            {/* Breadcrumb Navigation - only show when we have depth */}
            {currentDepth > 0 ? <BreadcrumbBar /> : null}

            {/* Content */}
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
    },
    vignette: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    content: {
        flex: 1,
        // ensure children are positioned above the vignette
    },
});
