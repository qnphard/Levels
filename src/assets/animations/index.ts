/**
 * Animation asset mapping
 * React Native requires static require() calls, so we map animation names to their assets
 */

// Import all animation assets statically
// These will be created when animations are generated
const animationAssets: Record<string, any> = {
  // Assets will be added here as they're generated
  // Format: 'animation-name': require('./animation-name.mp4'),
};

/**
 * Get animation asset by name
 * Returns undefined if asset doesn't exist
 */
export function getAnimationAsset(animationName: string): any | undefined {
  return animationAssets[animationName];
}

/**
 * Check if animation asset exists
 */
export function hasAnimationAsset(animationName: string): boolean {
  return animationName in animationAssets && animationAssets[animationName] !== undefined;
}

/**
 * Get all available animation names
 */
export function getAvailableAnimations(): string[] {
  return Object.keys(animationAssets).filter(name => animationAssets[name] !== undefined);
}

