const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Expo config plugin to disable PNG crunching in Android builds.
 * This prevents AAPT errors when building with large or complex PNG files.
 */
const withDisablePngCrunching = (config) => {
    return withGradleProperties(config, (config) => {
        // Add property to disable PNG crunching
        config.modResults.push({
            type: 'property',
            key: 'android.enablePngCrunchInReleaseBuilds',
            value: 'false',
        });
        return config;
    });
};

module.exports = withDisablePngCrunching;
