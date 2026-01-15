import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtmosphereDepth } from '../context/AtmosphereDepthContext';
import { spacing } from '../theme/colors';

/**
 * BreadcrumbBar
 * Displays the current navigation path (e.g., Shame › Felt Sense › Thoughts).
 * Allows users to tap on previous levels to go back.
 */
export const BreadcrumbBar = () => {
    const { depthStack, popDepth } = useAtmosphereDepth();

    if (depthStack.length === 0) return null;

    return (
        <View style={styles.container}>
            {depthStack.map((label, index) => (
                <View key={index} style={styles.breadcrumbItem}>
                    {index > 0 && (
                        <Ionicons
                            name="chevron-forward"
                            size={12}
                            color="rgba(255,255,255,0.4)"
                            style={styles.separator}
                        />
                    )}
                    <Pressable
                        onPress={() => {
                            // Logic to pop multiple levels if needed
                            // For now, just a placeholder for visual feedback
                        }}
                        disabled={index === depthStack.length - 1}
                    >
                        <Text style={[
                            styles.label,
                            index === depthStack.length - 1 && styles.activeLabel
                        ]}>
                            {label}
                        </Text>
                    </Pressable>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginLeft: spacing.lg,
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        zIndex: 1000,
    },
    breadcrumbItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        marginHorizontal: 6,
    },
    label: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    activeLabel: {
        color: 'white',
        fontWeight: '700',
    },
});

export default BreadcrumbBar;
