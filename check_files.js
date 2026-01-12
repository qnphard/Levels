
const fs = require('fs');
const path = require('path');

const testPath = 'c:\\Users\\Admin\\.gemini\\antigravity\\scratch\\Levels\\node_modules\\react-native-reanimated\\src\\common\\constants\\index.ts';

try {
    const stats = fs.statSync(testPath);
    console.log(`File exists: ${testPath}`);
    console.log(`Size: ${stats.size}`);
} catch (err) {
    console.error(`Error accessing file: ${err.message}`);
}

const dirPath = path.dirname(testPath);
try {
    const files = fs.readdirSync(dirPath);
    console.log(`Contents of ${dirPath}:`);
    console.log(files);
} catch (err) {
    console.error(`Error reading directory: ${err.message}`);
}
