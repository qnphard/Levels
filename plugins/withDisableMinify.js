const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Disables minification in release builds to avoid R8 stripping native modules.
 */
const withDisableMinify = (config) => {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const gradlePropsPath = path.join(
                config.modRequest.platformProjectRoot,
                'gradle.properties'
            );

            let content = '';
            if (fs.existsSync(gradlePropsPath)) {
                content = fs.readFileSync(gradlePropsPath, 'utf-8');
            }

            // Add property to disable minification
            const disableMinify = '\n# Disable minification to fix native library issues\nandroid.enableMinifyInReleaseBuilds=false\n';

            if (!content.includes('enableMinifyInReleaseBuilds')) {
                fs.writeFileSync(gradlePropsPath, content + disableMinify, 'utf-8');
            }

            return config;
        },
    ]);
};

module.exports = withDisableMinify;
