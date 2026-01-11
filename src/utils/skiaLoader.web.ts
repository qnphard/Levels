export const loadSkia = async (): Promise<void> => {
    try {
        const { LoadSkiaWeb } = require('@shopify/react-native-skia/lib/module/web');
        await LoadSkiaWeb();
        console.log('Skia Web Loaded successfully');
    } catch (err) {
        console.error('Failed to load Skia Web:', err);
        throw err;
    }
};
