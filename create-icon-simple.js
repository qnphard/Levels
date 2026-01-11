/**
 * Simple script to create app icon from steps image
 * Requires: sharp package (npm install sharp)
 * 
 * Usage: node create-icon-simple.js input.png output.png
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createAppIcon(inputPath, outputPath, size = 1024) {
  try {
    // Check if input exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: Input file not found: ${inputPath}`);
      process.exit(1);
    }

    // Read and process the image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Get dimensions
    const width = metadata.width;
    const height = metadata.height;
    const maxDim = Math.max(width, height);
    
    // Calculate safe zone (66% of diameter for Android circular crop)
    const safeZone = size * 0.66;
    
    // Resize to fill canvas while maintaining aspect ratio
    // Center the image and crop to square focusing on center
    const processed = await image
      .resize(size, size, {
        fit: 'cover',
        position: 'center', // Center the crop to keep steps visible
      })
      .png()
      .toBuffer();
    
    // Save the icon
    await sharp(processed)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✓ Created app icon: ${outputPath}`);
    console.log(`  Size: ${size}x${size}px`);
    console.log(`  Safe zone: ~${Math.round(safeZone)}px diameter (centered)`);
    console.log(`\n✓ Update app.json to use: ${outputPath}`);
  } catch (error) {
    console.error('Error creating icon:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const inputFile = process.argv[2] || 'steps-reference.png';
const outputFile = process.argv[3] || 'assets/images/app-icon-thumbnail.png';

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

createAppIcon(inputFile, outputFile);

