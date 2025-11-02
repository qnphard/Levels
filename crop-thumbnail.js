/**
 * Crop thumbnail to fit within Android's circular adaptive icon mask
 * Uses sharp for image processing
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function cropThumbnailForCircle(inputPath, outputPath, size = 1024) {
  try {
    console.log(`Loading image: ${inputPath}`);
    
    // Load image and get metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Original size: ${metadata.width}x${metadata.height}`);
    
    // For Android adaptive icons, the safe zone is about 66% of the diameter
    // But we'll use 80% to be safe and ensure nothing gets cut off
    const safeZonePercent = 0.80;
    const safeZoneSize = Math.floor(size * safeZonePercent);
    
    // First, ensure the image is square by padding if needed
    const maxDim = Math.max(metadata.width, metadata.height);
    const paddedSize = Math.max(maxDim, size);
    
    // Create a square canvas with transparent background
    let processed = await sharp({
      create: {
        width: paddedSize,
        height: paddedSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
    .composite([{
      input: await image.toBuffer(),
      gravity: 'center'
    }])
    .png()
    .toBuffer();
    
    // Now resize to target size and ensure content fits in safe zone
    // We'll center crop focusing on the middle portion
    const cropLeft = Math.floor((paddedSize - safeZoneSize) / 2);
    const cropTop = Math.floor((paddedSize - safeZoneSize) / 2);
    
    processed = await sharp(processed)
      .extract({
        left: cropLeft,
        top: cropTop,
        width: safeZoneSize,
        height: safeZoneSize
      })
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();
    
    // Create final square canvas
    const finalCanvas = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      }
    })
    .composite([{
      input: processed,
      gravity: 'center'
    }])
    .png()
    .toBuffer();
    
    // Save the cropped image
    await sharp(finalCanvas)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✓ Cropped thumbnail saved to: ${outputPath}`);
    console.log(`  Size: ${size}x${size}px`);
    console.log(`  Safe zone: ~${safeZoneSize}px diameter (centered)`);
    console.log(`  All content should now fit within the circular mask`);
    
  } catch (error) {
    console.error('Error cropping thumbnail:', error.message);
    process.exit(1);
  }
}

// Get paths
const inputFile = process.argv[2] || 'assets/images/levels-thumbnail.png';
const outputFile = process.argv[3] || inputFile; // Overwrite by default

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file not found: ${inputFile}`);
  process.exit(1);
}

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (outputDir && !fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

cropThumbnailForCircle(inputFile, outputFile);

