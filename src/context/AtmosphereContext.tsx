import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export type AtmosphereState = 'neutral' | 'purpose' | 'traps' | 'exits' | 'practices' | 'felt-sense';
export type DepthState = 'HUB' | 'REALM' | 'INSIGHT';
export type ParticleType = 'dust' | 'embers' | 'ash' | 'mist' | 'none';

interface AtmosphereRecipe {
    palette: string[];
    vignette: number;
    fogDensity: number;
    particles: ParticleType;
    soundHint: string;
    lightingStyle: 'low' | 'pulse' | 'scanning' | 'breathing';
}

interface AtmosphereContextType {
    atmosphere: AtmosphereState;
    setAtmosphere: (state: AtmosphereState) => void;
    depth: DepthState;
    setDepth: (depth: DepthState) => void;
    recipe: AtmosphereRecipe;
    setRecipeByLevel: (levelId: string) => void;

    lightingOpacity: Animated.Value;
    vignetteIntensity: Animated.Value;
    zoomLevel: Animated.Value;
}

const DEFAULT_RECIPE: AtmosphereRecipe = {
    palette: ['#000', '#111'],
    vignette: 0.35,
    fogDensity: 0.2,
    particles: 'dust',
    soundHint: 'ambient_low',
    lightingStyle: 'low'
};

const ATMOSPHERE_RECIPES: Record<string, AtmosphereRecipe> = {
    'shame': {
        palette: ['#2C2B28', '#3B1120'], // Charcoal/Purple
        vignette: 0.6,
        fogDensity: 0.5,
        particles: 'ash',
        soundHint: 'low_rumble',
        lightingStyle: 'breathing'
    },
    'fear': {
        palette: ['#1C1C1C', '#3A3509'],
        vignette: 0.5,
        fogDensity: 0.3,
        particles: 'mist',
        soundHint: 'wind_howl',
        lightingStyle: 'scanning'
    },
    'anger': {
        palette: ['#2A0000', '#4C1F1F'],
        vignette: 0.4,
        fogDensity: 0.2,
        particles: 'embers',
        soundHint: 'heat_hiss',
        lightingStyle: 'pulse'
    },
    'pride': {
        palette: ['#1A1A2E', '#2F2244'],
        vignette: 0.3,
        fogDensity: 0.1,
        particles: 'dust',
        soundHint: 'distant_bells',
        lightingStyle: 'low'
    }
};

const AtmosphereContext = createContext<AtmosphereContextType | undefined>(undefined);

export const useAtmosphere = () => {
    const context = useContext(AtmosphereContext);
    if (!context) {
        throw new Error('useAtmosphere must be used within an AtmosphereProvider');
    }
    return context;
};

const TRANSITION_DURATION = 1500;

export const AtmosphereProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [atmosphere, setAtmosphere] = useState<AtmosphereState>('neutral');
    const [depth, setDepth] = useState<DepthState>('HUB');
    const [recipe, setRecipe] = useState<AtmosphereRecipe>(DEFAULT_RECIPE);

    const lightingOpacity = useRef(new Animated.Value(0.2)).current;
    const vignetteIntensity = useRef(new Animated.Value(0.35)).current;
    const zoomLevel = useRef(new Animated.Value(1.0)).current;

    const setRecipeByLevel = (levelId: string) => {
        const selected = ATMOSPHERE_RECIPES[levelId] || DEFAULT_RECIPE;
        setRecipe(selected);
    };

    // Depth Transitions
    useEffect(() => {
        let targetZoom = 1.0;
        switch (depth) {
            case 'HUB': targetZoom = 1.0; break;
            case 'REALM': targetZoom = 1.8; break; // Slightly reduced to keep 2.5D perspective
            case 'INSIGHT': targetZoom = 2.5; break;
        }

        Animated.timing(zoomLevel, {
            toValue: targetZoom,
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true
        }).start();
    }, [depth]);

    // Atmosphere/Recipe Transitions
    useEffect(() => {
        // Base targets from recipe
        let targetGlow = recipe.lightingStyle === 'low' ? 0.2 : 0.4;
        let targetVignette = recipe.vignette;

        // Modifier based on sub-screen (atmosphere state)
        if (atmosphere === 'traps') {
            targetGlow *= 0.5;
            targetVignette += 0.2;
        } else if (atmosphere === 'exits') {
            targetGlow *= 1.5;
            targetVignette -= 0.1;
        }

        Animated.parallel([
            Animated.timing(lightingOpacity, {
                toValue: targetGlow,
                duration: TRANSITION_DURATION,
                useNativeDriver: true // Changed to true where possible
            }),
            Animated.timing(vignetteIntensity, {
                toValue: targetVignette,
                duration: TRANSITION_DURATION,
                useNativeDriver: true
            })
        ]).start();
    }, [atmosphere, recipe]);

    return (
        <AtmosphereContext.Provider value={{
            atmosphere,
            setAtmosphere,
            depth,
            setDepth,
            recipe,
            setRecipeByLevel,
            lightingOpacity,
            vignetteIntensity,
            zoomLevel
        }}>
            {children}
        </AtmosphereContext.Provider>
    );
};
