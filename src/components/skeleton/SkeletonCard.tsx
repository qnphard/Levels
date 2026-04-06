import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CardSurface } from '../CardSurface';
import { SkeletonLine } from './SkeletonLine';
import { spacing, borderRadius } from '../../theme/colors';

export type SkeletonCardLayout = 'meditation' | 'article' | 'generic';

export type SkeletonCardProps = {
  layout?: SkeletonCardLayout;
  /** Number of stacked skeleton cards */
  count?: number;
};

function MeditationSkeleton() {
  return (
    <View style={styles.row}>
      <SkeletonLine width={48} height={48} borderRadius={24} />
      <View style={styles.col}>
        <SkeletonLine width="90%" height={16} style={styles.mb} />
        <SkeletonLine width="70%" height={14} />
        <SkeletonLine width={100} height={20} style={styles.mt} borderRadius={borderRadius.roundedChip} />
      </View>
    </View>
  );
}

function ArticleSkeleton() {
  return (
    <View>
      <SkeletonLine width="100%" height={72} borderRadius={borderRadius.md} style={styles.mb} />
      <SkeletonLine width="85%" height={16} style={styles.mb} />
      <SkeletonLine width="60%" height={12} />
    </View>
  );
}

function GenericSkeleton() {
  return (
    <View>
      <SkeletonLine width="95%" height={14} style={styles.mb} />
      <SkeletonLine width="80%" height={14} style={styles.mb} />
      <SkeletonLine width="50%" height={14} />
    </View>
  );
}

/**
 * Placeholder card rows while list data loads.
 */
export function SkeletonCard({ layout = 'generic', count = 1 }: SkeletonCardProps) {
  const blocks = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {blocks.map((i) => (
        <CardSurface key={i} variant="default" style={styles.card}>
          {layout === 'meditation' && <MeditationSkeleton />}
          {layout === 'article' && <ArticleSkeleton />}
          {layout === 'generic' && <GenericSkeleton />}
        </CardSurface>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
    marginLeft: spacing.md,
  },
  mb: {
    marginBottom: spacing.sm,
  },
  mt: {
    marginTop: spacing.sm,
  },
});
