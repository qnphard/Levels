import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TierChip from './TierChip';

/**
 * TierLegend - Explains the three content tiers on the Essentials screen
 */
export default function TierLegend() {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.tierItem}>
                    <TierChip tier="foundation" size="small" />
                    <Text style={styles.description}>Start here</Text>
                </View>
                <View style={styles.tierItem}>
                    <TierChip tier="practice" size="small" />
                    <Text style={styles.description}>Apply daily</Text>
                </View>
                <View style={styles.tierItem}>
                    <TierChip tier="deep-dive" size="small" />
                    <Text style={styles.description}>Go deeper</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(20, 30, 50, 0.6)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tierItem: {
        alignItems: 'center',
        gap: 6,
    },
    description: {
        fontSize: 11,
        color: '#94a3b8',
        fontStyle: 'italic',
    },
});
