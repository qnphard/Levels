import React, { useLayoutEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Legacy route: stairs room — forward to Skia v2 room journey. */
export default function RoomOfLevelsScreen() {
    const navigation = useNavigation<NavigationProp>();

    useLayoutEffect(() => {
        navigation.replace('RoomOfLevels2');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#64748b" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f1eb', alignItems: 'center', justifyContent: 'center' },
});
