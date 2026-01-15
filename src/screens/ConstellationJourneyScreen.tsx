import React, { useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    StatusBar,
    BackHandler,
    ScrollView,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { consciousnessLevels } from '../data/levels';
import { ConsciousnessLevel } from '../types';
import { RootStackParamList } from '../navigation/types';
import { useThemeColors, spacing } from '../theme/colors';
import { useUserProgress } from '../context/UserProgressContext';
import { ConstellationMapView } from '../components/ConstellationMapView';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ConstellationJourneyScreen() {
    const navigation = useNavigation<NavigationProp>();
    const theme = useThemeColors();
    const { progress } = useUserProgress();
    const [viewMode, setViewMode] = useState<'constellation' | 'list'>('constellation');

    // Determine unlocked and completed levels based on progress
    const unlockedLevels = useMemo(() => {
        // For now, unlock all levels - can be made progressive later
        return consciousnessLevels.map(l => l.id);
    }, [progress]);

    const completedLevels = useMemo(() => {
        // Levels with articles read or practices done
        return Object.keys(progress).filter(id =>
            (progress[id]?.articlesRead || 0) > 0 ||
            (progress[id]?.practicesDone || 0) > 0
        );
    }, [progress]);

    const currentLevel = useMemo(() => {
        // Find the "current" level based on last activity or lowest uncompleted
        const incomplete = consciousnessLevels.find(l => !completedLevels.includes(l.id));
        return incomplete?.id || consciousnessLevels[0].id;
    }, [completedLevels]);

    const handlePressLevel = (level: ConsciousnessLevel) => {
        // Navigate to the level room
        navigation.navigate('LevelRoom', { levelId: level.id });
    };

    // Handle back button
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (!navigation.canGoBack()) {
                    BackHandler.exitApp();
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [navigation])
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Constellation Map View */}
            <ConstellationMapView
                levels={consciousnessLevels}
                unlockedLevels={unlockedLevels}
                completedLevels={completedLevels}
                currentLevel={currentLevel}
                onPressLevel={handlePressLevel}
            />

            {/* Header Overlay */}
            <View style={styles.headerOverlay} pointerEvents="box-none">
                <LinearGradient
                    colors={['rgba(10,10,26,0.95)', 'rgba(10,10,26,0.7)', 'transparent']}
                    style={styles.headerGradient}
                >
                    <Text style={styles.headerTitle}>Journey Map</Text>
                    <Text style={styles.headerSubtitle}>
                        {completedLevels.length} of {consciousnessLevels.length} levels explored
                    </Text>
                </LinearGradient>
            </View>

            {/* View Toggle */}
            <View style={styles.toggleContainer}>
                <Pressable
                    onPress={() => setViewMode(viewMode === 'constellation' ? 'list' : 'constellation')}
                    style={styles.toggleButton}
                >
                    <Ionicons
                        name={viewMode === 'constellation' ? 'list-outline' : 'sparkles-outline'}
                        size={20}
                        color="white"
                    />
                    <Text style={styles.toggleText}>
                        {viewMode === 'constellation' ? 'List View' : 'Map View'}
                    </Text>
                </Pressable>
            </View>

            {/* Zone Legend */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#6B21A8' }]} />
                    <Text style={styles.legendText}>Heavy Weather</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
                    <Text style={styles.legendText}>Stabilization</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
                    <Text style={styles.legendText}>Openness</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: spacing.xl,
    },
    headerTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 1,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginTop: 4,
    },
    toggleContainer: {
        position: 'absolute',
        top: 55,
        right: spacing.lg,
        zIndex: 101,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    toggleText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    legendContainer: {
        position: 'absolute',
        bottom: 100,
        left: spacing.lg,
        zIndex: 100,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        letterSpacing: 0.5,
    },
});
