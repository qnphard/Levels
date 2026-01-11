import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useUserStore, Milestone } from '../store/userStore';
import MilestoneUnlockedOverlay from './MilestoneUnlockedOverlay';

interface CelebrationProviderProps {
    children: React.ReactNode;
}

export default function CelebrationProvider({ children }: CelebrationProviderProps) {
    const pendingCelebration = useUserStore((s) => s.pendingCelebration);
    const dismissCelebration = useUserStore((s) => s.dismissCelebration);

    return (
        <View style={styles.container}>
            {children}
            {pendingCelebration && (
                <MilestoneUnlockedOverlay
                    milestone={pendingCelebration}
                    onDismiss={dismissCelebration}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
