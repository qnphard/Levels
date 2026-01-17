import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SkiaSpiralImpl } from '../levels3d';

export const AnimationShowcaseScreen: React.FC = () => {
    return (
        <View style={styles.fullContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a12" />
            <SkiaSpiralImpl />
        </View>
    );
};

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: '#0a0a12',
    },
});

export default AnimationShowcaseScreen;
