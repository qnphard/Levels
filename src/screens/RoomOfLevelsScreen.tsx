import React from 'react';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { LevelStairsMenu } from '../levels3d/components/LevelStairsMenu';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RoomOfLevelsScreen() {
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
            <StatusBar hidden />

            {/* Enhanced Level Stairs Menu */}
            <LevelStairsMenu onSelectSection={handleSelectLevel} />

            {/* Return Button */}
            <Pressable onPress={handleBack} style={styles.closeBtn}>
                <Ionicons name="close" size={28} color="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a12' },
    closeBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 100,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
