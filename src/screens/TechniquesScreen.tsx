import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PracticeSelector, { Practice } from '../components/PracticeSelector';
import { RootStackParamList } from '../navigation/types';
import { useThemeColors } from '../theme/colors';
import { LivingBackground } from '../components/LivingBackground';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TechniquesScreen() {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();

    const handleSelectPractice = (practice: Practice) => {
        navigation.navigate('PracticePlayer', { practiceId: practice.id });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LivingBackground />
            <PracticeSelector
                onSelect={handleSelectPractice}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
