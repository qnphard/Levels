/**
 * Import expo-video via concrete build files instead of package root.
 * Metro on some Windows setups fails to resolve ./VideoPlayer from expo-video/build/index.js
 * even when VideoPlayer.js exists; barrel imports bypass that.
 */
export { useVideoPlayer, createVideoPlayer } from 'expo-video/build/VideoPlayer';
export { VideoView } from 'expo-video/build/VideoView';
