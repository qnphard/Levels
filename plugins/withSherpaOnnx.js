const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withSherpaOnnx = (config) => {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const proguardPath = path.join(
                config.modRequest.platformProjectRoot,
                'app',
                'proguard-rules.pro'
            );

            let proguardContent = '';
            if (fs.existsSync(proguardPath)) {
                proguardContent = fs.readFileSync(proguardPath, 'utf-8');
            }

            const sherpaRules = `
# Keep Sherpa ONNX native classes
-keep class com.k2fsa.sherpa.** { *; }
-keep class com.sherpaonnxofflinetts.** { *; }
`;

            if (!proguardContent.includes('com.k2fsa.sherpa')) {
                fs.writeFileSync(proguardPath, proguardContent + sherpaRules, 'utf-8');
            }

            return config;
        },
    ]);
};

module.exports = withSherpaOnnx;
