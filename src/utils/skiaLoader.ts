import 'react-native-reanimated';
export const loadSkia = async (): Promise<void> => {
    // Skia is natively supported on Android/iOS, no manual loading required here
    return Promise.resolve();
};
