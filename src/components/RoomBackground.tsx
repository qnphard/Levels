import React, { useRef } from 'react';
import { StyleSheet, Animated, Dimensions, ImageSourcePropType, View, PanResponder } from 'react-native';

const { width, height } = Dimensions.get('window');

interface RoomBackgroundProps {
    layers: {
        far: ImageSourcePropType;
        mid: ImageSourcePropType;
        fg?: ImageSourcePropType;
    };
    zoomLevel?: Animated.Value;
    cameraShift?: Animated.ValueXY;
    scrollOffset?: Animated.Value; // Support driving parallax from scroll
}

export const RoomBackground: React.FC<RoomBackgroundProps> = ({ layers, zoomLevel, cameraShift, scrollOffset }) => {
    // Parallax Animated Values
    const panX = useRef(new Animated.Value(0)).current;

    // Default zoom if not provided (fallback to 1.0)
    const activeZoom = zoomLevel || useRef(new Animated.Value(1.0)).current;

    // Driven by either manual pan or external scroll
    const driveValue = scrollOffset || panX;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return !scrollOffset && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderMove: (_, gestureState) => {
                const sensitivity = 0.5;
                panX.setValue(gestureState.dx * sensitivity);
            },
            onPanResponderRelease: () => {
                Animated.spring(panX, {
                    toValue: 0,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true
                }).start();
            }
        })
    ).current;

    // Base Scale (1.2 to cover edges during pan) * Zoom Level
    const finalScale = Animated.multiply(activeZoom, 1.2);

    const shiftX = cameraShift?.x || new Animated.Value(0);
    const shiftY = cameraShift?.y || new Animated.Value(0);

    // Dynamic Interpolations for Deep Parallax
    const farTranslate = driveValue.interpolate({
        inputRange: [-width, 0, width],
        outputRange: [15, 0, -15],
        extrapolate: 'clamp'
    });

    const midTranslate = driveValue.interpolate({
        inputRange: [-width, 0, width],
        outputRange: [40, 0, -40],
        extrapolate: 'clamp'
    });

    const fgTranslate = driveValue.interpolate({
        inputRange: [-width, 0, width],
        outputRange: [70, 0, -70],
        extrapolate: 'clamp'
    });

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            {/* 1. FAR LAYER (Deep spatial texture) */}
            <Animated.Image
                source={layers.far}
                style={[
                    styles.layer,
                    {
                        transform: [
                            { scale: finalScale },
                            { translateX: farTranslate },
                            { translateX: Animated.multiply(shiftX, 0.4) },
                            { translateY: Animated.multiply(shiftY, 0.4) }
                        ]
                    }
                ]}
                resizeMode="cover"
            />

            {/* 2. MID LAYER (Fog, dust, drifting elements) */}
            <Animated.Image
                source={layers.mid}
                style={[
                    styles.layer,
                    {
                        transform: [
                            { scale: finalScale },
                            { translateX: midTranslate },
                            { translateX: Animated.multiply(shiftX, 0.7) },
                            { translateY: Animated.multiply(shiftY, 0.7) }
                        ],
                        opacity: 0.8 // Allow far to peek through
                    }
                ]}
                resizeMode="cover"
            />

            {/* 3. FOREGROUND LAYER (Floating particles, close vignettes) */}
            {layers.fg ? (
                <Animated.Image
                    source={layers.fg}
                    style={[
                        styles.layer,
                        {
                            transform: [
                                { scale: Animated.multiply(finalScale, 1.1) },
                                { translateX: fgTranslate },
                                { translateX: shiftX },
                                { translateY: shiftY }
                            ]
                        }
                    ]}
                    resizeMode="cover"
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    layer: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
    }
});
