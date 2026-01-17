import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getLevelById } from '../data/levels';
import { Ionicons } from '@expo/vector-icons';
import LevelStairsMenu from '../levels3d/components/LevelStairsMenu';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'LevelContentMenu'>;

export const LevelContentMenuScreen = () => {
    const navigation = useNavigation<NavProp>();
    const route = useRoute<RouteProps>();
    const { levelId } = route.params;

    const levelData = getLevelById(levelId);
    if (!levelData) return null;

    const handleSelect = (sectionId: string) => {
        navigation.navigate('LevelRoom', {
            levelId,
            initialHotspot: sectionId
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* 3D Background & Menu */}
            <View style={StyleSheet.absoluteFill}>
                <LevelStairsMenu onSelectSection={handleSelect} />
            </View>

            {/* Header Overlay */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>
                <View>
                    <Text style={[styles.levelTitle, { color: levelData.color || 'white' }]}>{levelData.name}</Text>
                    <Text style={styles.levelSubtitle}>Calibration {levelData.level}</Text>
                </View>
            </View>

            {/* Gradient fade at bottom */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.95)']}
                style={[StyleSheet.absoluteFill, { top: '85%' }]}
                pointerEvents="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    header: {
        marginTop: 60,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    levelTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 10,
    },
    levelSubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
    }
});

export default LevelContentMenuScreen;
