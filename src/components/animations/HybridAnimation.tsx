import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from '../../shims/expoVideo';
import { Asset } from 'expo-asset';
import { getAnimationAsset, hasAnimationAsset } from '../../assets/animations';

const { width } = Dimensions.get('window');
const ANIMATION_WIDTH = Math.min(width - 40, 350);

interface HybridAnimationProps {
  /**
   * Name of the animation (used to locate asset)
   * e.g., 'desire-black-hole', 'power-vs-force'
   */
  animationName: string;

  /**
   * Fallback code-based animation component
   */
  CodeAnimation: React.ComponentType<any>;

  /**
   * Animation height
   */
  height?: number;

  /**
   * Whether to prefer asset over code animation
   */
  preferAsset?: boolean;

  /**
   * Auto-play for code animation fallback
   */
  autoPlay?: boolean;

  /**
   * Callback when animation is interacted with
   */
  onInteraction?: () => void;
}

type HybridVideoProps = {
  animationName: string;
  height: number;
};

function HybridVideoPlayer({ animationName, height }: HybridVideoProps) {
  const moduleRef = getAnimationAsset(animationName);
  const player = useVideoPlayer(moduleRef!, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <View style={[styles.container, { height }]}>
      <VideoView player={player} style={styles.video} contentFit="contain" nativeControls={false} />
    </View>
  );
}

/**
 * Hybrid animation component that tries to load a pre-rendered video asset,
 * falls back to code-based animation if asset is not available
 */
export default function HybridAnimation({
  animationName,
  CodeAnimation,
  height = 200,
  preferAsset = true,
  autoPlay = true,
  onInteraction,
}: HybridAnimationProps) {
  const [assetLoaded, setAssetLoaded] = useState(false);
  const [assetError, setAssetError] = useState(false);

  // Try to load asset
  useEffect(() => {
    if (!preferAsset) {
      setAssetError(true);
      return;
    }

    const loadAsset = async () => {
      try {
        if (!hasAnimationAsset(animationName)) {
          setAssetError(true);
          return;
        }

        const assetModule = getAnimationAsset(animationName);
        if (!assetModule) {
          setAssetError(true);
          return;
        }

        const asset = Asset.fromModule(assetModule);
        await asset.downloadAsync();
        setAssetLoaded(true);
      } catch {
        console.log(`Asset not found for ${animationName}, using code animation`);
        setAssetError(true);
      }
    };

    loadAsset();
  }, [animationName, preferAsset]);

  // If asset is preferred and loaded, show video
  if (preferAsset && assetLoaded && !assetError) {
    if (!getAnimationAsset(animationName)) {
      return (
        <View style={[styles.container, { height }]}>
          <CodeAnimation autoPlay={autoPlay} onInteraction={onInteraction} />
        </View>
      );
    }

    return <HybridVideoPlayer key={animationName} animationName={animationName} height={height} />;
  }

  // Fallback to code animation
  return (
    <View style={[styles.container, { height }]}>
      <CodeAnimation autoPlay={autoPlay} onInteraction={onInteraction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ANIMATION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  video: {
    width: ANIMATION_WIDTH,
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
