/**
 * Configuration for hybrid animations
 * Determines which animations should use pre-rendered assets vs code
 */

export interface AnimationConfig {
  /**
   * Animation identifier
   */
  name: string;
  
  /**
   * Whether to prefer asset over code animation
   */
  preferAsset: boolean;
  
  /**
   * COMFYUI generation settings
   */
  comfyuiConfig?: {
    /**
     * Prompt for generating the animation
     */
    prompt: string;
    
    /**
     * Negative prompt
     */
    negativePrompt?: string;
    
    /**
     * Number of frames
     */
    frames?: number;
    
    /**
     * FPS
     */
    fps?: number;
    
    /**
     * Dimensions: [width, height]
     */
    dimensions?: [number, number];
    
    /**
     * Style guidance
     */
    style?: string;
    
    /**
     * Color scheme
     */
    colors?: string[];
  };
}

/**
 * Animation configurations for COMFYUI generation
 */
export const animationConfigs: Record<string, AnimationConfig> = {
  'desire-black-hole': {
    name: 'desire-black-hole',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'A mesmerizing black hole in deep space, purple and dark blue accretion disk rotating around a dark center, particles spiraling inward in a vortex, glowing energy trails, cosmic dust, ethereal purple and blue light, smooth rotation, loop animation, spiritual and mystical atmosphere, high contrast, vibrant colors',
      negativePrompt: 'static image, still frame, low quality, blurry, pixelated, distorted',
      frames: 120,
      fps: 24,
      dimensions: [512, 512],
      style: 'spiritual, mystical, cosmic, ethereal, smooth animation, seamless loop',
      colors: ['#8B5CF6', '#6366F1', '#000000', '#1E1B4B'],
    },
  },
  
  'power-vs-force': {
    name: 'power-vs-force',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Two contrasting energy flows side by side: left side shows chaotic red force energy pushing against a wall, particles bouncing and scattering, exhausting movement. Right side shows smooth blue power energy flowing effortlessly like water, gentle waves, harmonious motion, peaceful and effortless, smooth transitions, loop animation',
      negativePrompt: 'static, still, low quality, blurry, choppy animation',
      frames: 90,
      fps: 24,
      dimensions: [512, 256],
      style: 'spiritual animation, smooth motion, contrasting energies, cartoon style but professional',
      colors: ['#60A5FA', '#F87171', '#1E293B'],
    },
  },
  
  'natural-happiness': {
    name: 'natural-happiness',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'A beautiful sky scene with fluffy white clouds drifting slowly, bright sun shining through, warm golden light, peaceful blue sky, clouds moving gently, sun pulsing softly with warm glow, serene and calming atmosphere, smooth cloud movement, loop animation, spiritual and peaceful',
      negativePrompt: 'dark, stormy, chaotic, low quality, blurry, static',
      frames: 100,
      fps: 24,
      dimensions: [512, 384],
      style: 'peaceful, serene, warm, spiritual, smooth animation, seamless loop',
      colors: ['#FCD34D', '#FFFFFF', '#60A5FA', '#E0F2FE'],
    },
  },
  
  'energy-leak': {
    name: 'energy-leak',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Energy flowing upward like a fountain, blocked by gray emotional barriers, energy leaking out in curved streams, glowing green energy particles escaping, barriers dissolving when energy flows through, smooth particle trails, loop animation, spiritual energy visualization',
      negativePrompt: 'static, choppy, low quality, blurry, pixelated',
      frames: 110,
      fps: 24,
      dimensions: [512, 512],
      style: 'spiritual energy, smooth particles, ethereal, glowing, seamless loop',
      colors: ['#34D399', '#6EE7B7', '#9CA3AF', '#1F2937'],
    },
  },
  
  'knowledge-vs-practice': {
    name: 'knowledge-vs-practice',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Left side: static books stacked, knowledge represented as still books. Right side: dynamic circle pulsing with energy, ripples expanding outward, particles radiating, active and alive, smooth pulsing motion, loop animation, contrasting static vs dynamic',
      negativePrompt: 'static, still, low quality, blurry, choppy',
      frames: 80,
      fps: 24,
      dimensions: [512, 256],
      style: 'spiritual animation, smooth motion, contrasting concepts, professional cartoon style',
      colors: ['#8B5CF6', '#A78BFA', '#1E293B'],
    },
  },
  
  'levels-of-truth': {
    name: 'levels-of-truth',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Four independent glowing circles arranged in space, each pulsing at different rhythms, connected by subtle energy lines, purple and blue glowing orbs, each representing a different level of truth, smooth pulsing animations, independent but connected, loop animation, spiritual and mystical',
      negativePrompt: 'static, synchronized, low quality, blurry',
      frames: 100,
      fps: 24,
      dimensions: [512, 512],
      style: 'spiritual, mystical, independent rhythms, smooth pulsing, seamless loop',
      colors: ['#8B5CF6', '#6366F1', '#4F46E5', '#3730A3'],
    },
  },
  
  'reprogramming-transition': {
    name: 'reprogramming-transition',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Old programming represented as fading gray box shrinking, new programming as glowing purple box growing and expanding, particles transitioning between them, smooth morphing transition, transformation animation, loop animation, spiritual reprogramming visualization',
      negativePrompt: 'static, abrupt transition, low quality, blurry',
      frames: 90,
      fps: 24,
      dimensions: [512, 256],
      style: 'spiritual transformation, smooth transition, glowing effects, seamless loop',
      colors: ['#8B5CF6', '#A78BFA', '#9CA3AF', '#1F2937'],
    },
  },
  
  'resistance-flow': {
    name: 'resistance-flow',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Two energy bars side by side: left shows red resistance block pushing against wall with squash and stretch, exhausting movement. Right shows blue flow block moving smoothly, glowing with energy, effortless motion, smooth transitions, loop animation, contrasting resistance vs flow',
      negativePrompt: 'static, choppy, low quality, blurry',
      frames: 85,
      fps: 24,
      dimensions: [512, 256],
      style: 'spiritual animation, smooth motion, cartoon physics, professional',
      colors: ['#60A5FA', '#F87171', '#1E293B'],
    },
  },
  
  'intention-ripple': {
    name: 'intention-ripple',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Center point pulsing with purple glow, expanding ripple waves radiating outward, awareness indicators appearing around the ripples, smooth expanding circles, glowing particles, spiritual intention visualization, loop animation, peaceful and focused',
      negativePrompt: 'static, choppy, low quality, blurry, chaotic',
      frames: 95,
      fps: 24,
      dimensions: [512, 512],
      style: 'spiritual, peaceful, smooth ripples, glowing effects, seamless loop',
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#1E293B'],
    },
  },
  
  'music-vibration': {
    name: 'music-vibration',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Two sets of audio waves: left side shows chaotic red high-frequency waves, irregular and jarring. Right side shows smooth blue harmonious waves, flowing and peaceful, contrasting anger-based vs classical music, smooth wave animations, loop animation',
      negativePrompt: 'static, still, low quality, blurry',
      frames: 100,
      fps: 24,
      dimensions: [512, 256],
      style: 'spiritual animation, smooth waves, contrasting energies, professional',
      colors: ['#F87171', '#60A5FA', '#1E293B'],
    },
  },
  
  'spiritual-progress-spiral': {
    name: 'spiritual-progress-spiral',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Spiral path traced through space, glowing dot moving along the spiral with vertical oscillation showing ups and downs, purple energy trail, non-linear spiritual progress visualization, smooth spiral motion, loop animation, mystical and spiritual',
      negativePrompt: 'linear, straight, static, low quality, blurry',
      frames: 120,
      fps: 24,
      dimensions: [512, 512],
      style: 'spiritual, mystical, smooth spiral, glowing trail, seamless loop',
      colors: ['#8B5CF6', '#6366F1', '#1E293B'],
    },
  },
  
  'addiction-cloud': {
    name: 'addiction-cloud',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Sky scene with sun always shining, clouds appearing and disappearing, drug effect temporarily clears clouds, withdrawal brings thicker clouds back, sun pulsing gently, smooth cloud transitions, loop animation, spiritual metaphor for addiction',
      negativePrompt: 'static, choppy, low quality, blurry',
      frames: 110,
      fps: 24,
      dimensions: [512, 384],
      style: 'spiritual metaphor, smooth transitions, peaceful sky, seamless loop',
      colors: ['#FCD34D', '#FFFFFF', '#9CA3AF', '#60A5FA'],
    },
  },
  
  'reaction-vs-power': {
    name: 'reaction-vs-power',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Two circles: left shows red reaction circle bouncing when triggered, losing power and fading. Right shows blue power circle stable and radiating energy outward, maintaining power, smooth animations, loop animation, contrasting reaction vs power',
      negativePrompt: 'static, choppy, low quality, blurry',
      frames: 90,
      fps: 24,
      dimensions: [512, 256],
      style: 'spiritual animation, smooth motion, contrasting concepts, professional',
      colors: ['#60A5FA', '#F87171', '#1E293B'],
    },
  },
  
  'body-mind-spirit-layers': {
    name: 'body-mind-spirit-layers',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Three horizontal layers stacked: body layer (red tension transitioning to green relaxation), mind layer (red tension to green relaxation), spirit layer (red tension to green relaxation), letting go indicator appearing, smooth layer-by-layer relaxation, loop animation, spiritual healing visualization',
      negativePrompt: 'static, choppy, low quality, blurry',
      frames: 100,
      fps: 24,
      dimensions: [512, 384],
      style: 'spiritual healing, smooth transitions, layered relaxation, seamless loop',
      colors: ['#F87171', '#34D399', '#1E293B'],
    },
  },
  
  'shadow-illumination': {
    name: 'shadow-illumination',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Dark shadow circle in center, acknowledgment indicator appears, then golden light expands and illuminates the shadow, shadow shrinks and fades as light grows, smooth illumination transition, loop animation, spiritual shadow work visualization',
      negativePrompt: 'static, abrupt, low quality, blurry',
      frames: 95,
      fps: 24,
      dimensions: [512, 512],
      style: 'spiritual illumination, smooth transition, glowing light, seamless loop',
      colors: ['#000000', '#FCD34D', '#FEF3C7', '#1E293B'],
    },
  },
  
  'fear-grief-spill': {
    name: 'fear-grief-spill',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Container filling with accumulated fear/grief energy (red/orange), energy spilling out into life experiences, spill effect flowing, life experience indicators appearing, smooth filling and spilling animation, loop animation, spiritual emotional processing',
      negativePrompt: 'static, choppy, low quality, blurry',
      frames: 105,
      fps: 24,
      dimensions: [512, 384],
      style: 'spiritual emotion, smooth flow, energy visualization, seamless loop',
      colors: ['#F87171', '#F59E0B', '#1E293B'],
    },
  },
  
  'emotional-stack-collapse': {
    name: 'emotional-stack-collapse',
    preferAsset: true,
    comfyuiConfig: {
      prompt: 'Stack of emotional layers collapsing from bottom up, energy release from bottom, layers dissolving as they collapse, smooth collapse animation, loop animation, spiritual emotional release visualization',
      negativePrompt: 'static, choppy, low quality, blurry',
      frames: 100,
      fps: 24,
      dimensions: [512, 384],
      style: 'spiritual release, smooth collapse, energy visualization, seamless loop',
      colors: ['#F87171', '#34D399', '#1E293B'],
    },
  },
};

/**
 * Get configuration for an animation
 */
export function getAnimationConfig(name: string): AnimationConfig | undefined {
  return animationConfigs[name];
}

/**
 * Get all animation names that prefer assets
 */
export function getAssetPreferringAnimations(): string[] {
  return Object.values(animationConfigs)
    .filter(config => config.preferAsset)
    .map(config => config.name);
}

