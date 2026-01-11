const { withProguardRules } = require('@expo/config-plugins');

const withSherpaOnnx = (config) => {
    return withProguardRules(config, (config) => {
        // Append the rule to the end of the existing content
        config.modResults.contents += '\n# Keep Sherpa ONNX native classes\n-keep class com.k2fsa.sherpa.** { *; }\n-keep class com.sherpaonnxofflinetts.** { *; }\n';
        return config;
    });
};

module.exports = withSherpaOnnx;
