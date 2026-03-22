import React from 'react';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import RoomOfLevelsSkiaExperience from '../levels3d/components/RoomOfLevelsSkiaExperience';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Room of Levels v2 — Skia + Reanimated room; walk animation then navigate to level. */
export default function RoomOfLevels2Screen() {
    const navigation = useNavigation<NavigationProp>();

    const handleSelectLevel = (levelId: string) => {
        navigation.navigate('LevelRoom', { levelId });
    };

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('Main');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <RoomOfLevelsSkiaExperience onSelectLevel={handleSelectLevel} />

            <Pressable onPress={handleBack} style={styles.closeBtn} accessibilityLabel="Close">
                <Ionicons name="close" size={26} color="#334155" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignSelf: 'stretch',
        backgroundColor: '#f4f1eb',
        overflow: 'visible',
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 100,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(148,163,184,0.35)',
    },
});
