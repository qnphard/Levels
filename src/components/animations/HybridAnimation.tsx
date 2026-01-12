import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
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
  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus | null>(null);
  const videoRef = React.useRef<Video>(null);

  // Try to load asset
  useEffect(() => {
    if (!preferAsset) {
      setAssetError(true);
      return;
    }

    const loadAsset = async () => {
      try {
        // Check if asset exists using static mapping
        if (!hasAnimationAsset(animationName)) {
          // Asset not found, use code animation
          setAssetError(true);
          return;
        }
        
        // Get asset from static mapping
        const assetModule = getAnimationAsset(animationName);
        if (!assetModule) {
          setAssetError(true);
          return;
        }
        
        const asset = Asset.fromModule(assetModule);
        await asset.downloadAsync();
        setAssetLoaded(true);
      } catch (error) {
        console.log(`Asset not found for ${animationName}, using code animation`);
        setAssetError(true);
      }
    };

    loadAsset();
  }, [animationName, preferAsset]);

  // Handle video playback
  useEffect(() => {
    if (assetLoaded && videoRef.current) {
      videoRef.current.setIsLoopingAsync(true);
      videoRef.current.playAsync();
    }
  }, [assetLoaded]);

  // If asset is preferred and loaded, show video
  if (preferAsset && assetLoaded && !assetError) {
    const videoSource = getAnimationAsset(animationName);
    
    if (!videoSource) {
      // Fallback to code animation if asset not found
      return (
        <View style={[styles.container, { height }]}>
          <CodeAnimation autoPlay={autoPlay} onInteraction={onInteraction} />
        </View>
      );
    }

    return (
      <View style={[styles.container, { height }]}>
        <Video
          ref={videoRef}
          source={videoSource}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            setVideoStatus(status);
            if (status.isLoaded && status.didJustFinish) {
              // Restart video when it finishes
              videoRef.current?.replayAsync();
            }
          }}
        />
      </View>
    );
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

