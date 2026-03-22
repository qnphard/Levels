import React, { useLayoutEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getLevelById } from '../data/levels';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'LevelContentMenu'>;

/** Legacy stairs content menu — open the level room directly (no LevelStairsMenu). */
export const LevelContentMenuScreen = () => {
    const navigation = useNavigation<NavProp>();
    const route = useRoute<RouteProps>();
    const { levelId } = route.params;

    const levelData = getLevelById(levelId);

    useLayoutEffect(() => {
        if (!levelData) return;
        navigation.replace('LevelRoom', { levelId });
    }, [navigation, levelId, levelData]);

    if (!levelData) return null;

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#94a3b8" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LevelContentMenuScreen;
