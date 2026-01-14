import React, { useRef } from 'react';
import { StyleSheet, Animated, Dimensions, ImageSourcePropType, View, PanResponder } from 'react-native';

const { width, height } = Dimensions.get('window');

interface RoomBackgroundProps {
    layers: {
        far: ImageSourcePropType;
        mid: ImageSourcePropType;
        fg: ImageSourcePropType;
    };
    zoomLevel?: Animated.Value;
}

export const RoomBackground: React.FC<RoomBackgroundProps> = ({ layers, zoomLevel }) => {
    // Parallax Animated Values
    const panX = useRef(new Animated.Value(0)).current;

    // Default zoom if not provided (fallback to 1.0)
    const activeZoom = zoomLevel || useRef(new Animated.Value(1.0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only capture horizontal drags
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderMove: (_, gestureState) => {
                // Clamp the movement to avoid seeing edges
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

    // Base Scale (1.1 to cover edges) * Zoom Level
    const finalScale = Animated.multiply(activeZoom, 1.1);

    // Interpolations for Parallax Depth
    const farTranslate = panX.interpolate({
        inputRange: [-width, width],
        outputRange: [10, -10],
        extrapolate: 'clamp'
    });

    const midTranslate = panX.interpolate({
        inputRange: [-width, width],
        outputRange: [25, -25],
        extrapolate: 'clamp'
    });

    const fgTranslate = panX.interpolate({
        inputRange: [-width, width],
        outputRange: [40, -40],
        extrapolate: 'clamp'
    });

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            {/* Far Layer */}
            <Animated.Image
                source={layers.far}
                style={[
                    styles.layer,
                    { transform: [{ translateX: farTranslate }, { scale: finalScale }] }
                ]}
                resizeMode="cover"
            />

            {/* Mid Layer */}
            <Animated.Image
                source={layers.mid}
                style={[
                    styles.layer,
                    { transform: [{ translateX: midTranslate }, { scale: finalScale }] }
                ]}
                resizeMode="cover"
            />

            {/* Foreground Layer */}
            {layers.fg && (
                <Animated.Image
                    source={layers.fg}
                    style={[
                        styles.layer,
                        { transform: [{ translateX: fgTranslate }, { scale: finalScale }] }
                    ]}
                    resizeMode="cover"
                />
            )}
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
