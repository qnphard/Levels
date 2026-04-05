import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from '../shims/expoVideo';
import { useEventListener } from 'expo';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface VideoSplashScreenProps {
    onFinish: () => void;
    onReady: () => void;
    allowFinish: boolean;
}

export const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onFinish, onReady, allowFinish }) => {
    const player = useVideoPlayer(require('../assets/animations/splash.mp4'), (p) => {
        p.loop = false;
        p.play();
    });
    const opacity = useSharedValue(1);
    const [videoEnded, setVideoEnded] = useState(false);
    const readyRef = useRef(false);

    const signalReady = () => {
        if (readyRef.current) return;
        readyRef.current = true;
        onReady();
    };

    /** Native splash stays until `onReady` → if `onLoad` never fires (Expo Go, codec, huge asset), don't hang forever. */
    useEffect(() => {
        const t = setTimeout(() => signalReady(), 8000);
        return () => clearTimeout(t);
    }, []);

    useEventListener(player, 'playToEnd', () => {
        setVideoEnded(true);
    });

    useEffect(() => {
        if (videoEnded && allowFinish) {
            opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                if (finished) {
                    // animation finished
                }
            });
            setTimeout(onFinish, 500);
        }
    }, [videoEnded, allowFinish, onFinish]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.container, animatedStyle]}>
            <VideoView
                player={player}
                style={StyleSheet.absoluteFill}
                contentFit="contain"
                nativeControls={false}
                onFirstFrameRender={onReady}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        zIndex: 9999,
    },
});
