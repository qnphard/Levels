import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface VideoSplashScreenProps {
    onFinish: () => void;
    onReady: () => void;
    allowFinish: boolean;
}

export const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onFinish, onReady, allowFinish }) => {
    const [status, setStatus] = useState<any>({});
    const video = useRef<Video>(null);
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

    const onPlaybackStatusUpdate = (status: any) => {
        setStatus(status);
        if (status.didJustFinish && !videoEnded) {
            setVideoEnded(true);
        }
    };

    useEffect(() => {
        if (videoEnded && allowFinish) {
            opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                if (finished) {
                    // animation finished
                }
            });
            setTimeout(onFinish, 500);
        }
    }, [videoEnded, allowFinish]);

    const onScanLoad = () => {
        signalReady();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.container, animatedStyle]}>
            <Video
                ref={video}
                style={StyleSheet.absoluteFill}
                source={require('../assets/animations/splash.mp4')}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                shouldPlay={true}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                onLoad={onScanLoad}
                onError={() => signalReady()}
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
