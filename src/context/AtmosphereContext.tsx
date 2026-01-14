import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export type AtmosphereState = 'neutral' | 'purpose' | 'traps' | 'exits' | 'practices' | 'felt-sense';
export type DepthState = 'HUB' | 'REALM' | 'INSIGHT';

interface AtmosphereContextType {
    atmosphere: AtmosphereState;
    setAtmosphere: (state: AtmosphereState) => void;

    depth: DepthState;
    setDepth: (depth: DepthState) => void;

    lightingOpacity: Animated.Value;
    vignetteIntensity: Animated.Value;
    tintColor: Animated.Value;
    zoomLevel: Animated.Value; // 1.0 -> 3.0+
}

const AtmosphereContext = createContext<AtmosphereContextType | undefined>(undefined);

export const useAtmosphere = () => {
    const context = useContext(AtmosphereContext);
    if (!context) {
        throw new Error('useAtmosphere must be used within an AtmosphereProvider');
    }
    return context;
};

// Animation constants
const TRANSITION_DURATION = 1000;

export const AtmosphereProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [atmosphere, setAtmosphere] = useState<AtmosphereState>('neutral');
    const [depth, setDepth] = useState<DepthState>('HUB');

    // Animated Values
    const lightingOpacity = useRef(new Animated.Value(0.2)).current;
    const vignetteIntensity = useRef(new Animated.Value(0.35)).current;
    const tintColor = useRef(new Animated.Value(0)).current;
    const zoomLevel = useRef(new Animated.Value(1.0)).current;

    // Depth Transition Effect
    useEffect(() => {
        let targetZoom = 1.0;

        switch (depth) {
            case 'HUB':
                targetZoom = 1.0;
                break;
            case 'REALM':
                targetZoom = 2.5; // Significant zoom in
                break;
            case 'INSIGHT':
                targetZoom = 3.0; // Subtle push further
                break;
        }

        Animated.timing(zoomLevel, {
            toValue: targetZoom,
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Ease-out quad
            useNativeDriver: true
        }).start();

    }, [depth]);

    // Atmosphere Transition Logic
    useEffect(() => {
        let targetGlow = 0.2;
        let targetVignette = 0.35;
        let targetTint = 0;

        switch (atmosphere) {
            case 'neutral':
                targetGlow = 0.20;
                targetVignette = 0.35;
                targetTint = 0;
                break;
            case 'purpose':
                targetGlow = 0.30;
                targetVignette = 0.30;
                targetTint = 1;
                break;
            case 'traps':
                targetGlow = 0.10;
                targetVignette = 0.55;
                targetTint = 3;
                break;
            case 'exits':
                targetGlow = 0.50;
                targetVignette = 0.20;
                targetTint = 0;
                break;
            case 'practices':
                targetGlow = 0.30;
                targetVignette = 0.35;
                targetTint = 1;
                break;
            case 'felt-sense':
                targetGlow = 0.40;
                targetVignette = 0.45;
                targetTint = 2; // Cold/Somatic
                break;
        }

        Animated.parallel([
            Animated.timing(lightingOpacity, {
                toValue: targetGlow,
                duration: TRANSITION_DURATION,
                useNativeDriver: false
            }),
            Animated.timing(vignetteIntensity, {
                toValue: targetVignette,
                duration: TRANSITION_DURATION,
                useNativeDriver: true
            }),
            Animated.timing(tintColor, {
                toValue: targetTint,
                duration: TRANSITION_DURATION,
                useNativeDriver: false
            })
        ]).start();

    }, [atmosphere]);

    return (
        <AtmosphereContext.Provider value={{
            atmosphere,
            setAtmosphere,
            depth,
            setDepth,
            lightingOpacity,
            vignetteIntensity,
            tintColor,
            zoomLevel
        }}>
            {children}
        </AtmosphereContext.Provider>
    );
};
