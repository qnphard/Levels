import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Circle, Group, LinearGradient, vec } from "@shopify/react-native-skia";

export default function SkiaTestAnimation() {
    return (
        <View style={styles.container}>
            <Canvas style={{ flex: 1 }}>
                <Group>
                    <LinearGradient
                        start={vec(0, 0)}
                        end={vec(256, 256)}
                        colors={["cyan", "magenta"]}
                    />
                    <Circle cx={128} cy={128} r={128} />
                </Group>
            </Canvas>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 256,
        height: 256,
        backgroundColor: '#000',
    },
});
