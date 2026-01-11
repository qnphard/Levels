#!/usr/bin/env python3
"""
Create a circular-cropped app icon for Android adaptive icons.
The icon will be optimized to fit within Android's circular crop area.
"""

from PIL import Image, ImageDraw
import sys
import os

def create_circular_icon(input_path, output_path, size=1024):
    """
    Create a circular-cropped icon optimized for Android adaptive icons.
    
    Android adaptive icons are displayed in a circular mask, so we need to ensure
    the important content is within the central ~66% of the image (safe zone).
    """
    # Open the input image
    img = Image.open(input_path)
    
    # Convert RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get dimensions
    width, height = img.size
    
    # Create a square canvas with white background (or transparent)
    canvas_size = max(width, height, size)
    canvas = Image.new('RGBA', (canvas_size, canvas_size), (255, 255, 255, 0))
    
    # Calculate center position
    x_offset = (canvas_size - width) // 2
    y_offset = (canvas_size - height) // 2
    
    # Paste the image centered on the canvas
    canvas.paste(img, (x_offset, y_offset), img if img.mode == 'RGBA' else None)
    
    # For Android adaptive icons, ensure content is in the safe zone
    # The safe zone is about 66% of the diameter (center 33% on each side)
    safe_zone_radius = int(canvas_size * 0.33)
    center_x, center_y = canvas_size // 2, canvas_size // 2
    
    # Crop to focus on the center (where the steps are)
    # Since the steps are diagonal, we want to crop tightly around them
    # Adjust crop box to center the diagonal steps
    crop_margin = int(canvas_size * 0.15)  # 15% margin to keep important content
    
    # Calculate crop box that centers the steps
    left = max(0, center_x - safe_zone_radius - crop_margin)
    top = max(0, center_y - safe_zone_radius - crop_margin)
    right = min(canvas_size, center_x + safe_zone_radius + crop_margin)
    bottom = min(canvas_size, center_y + safe_zone_radius + crop_margin)
    
    # Crop the image
    cropped = canvas.crop((left, top, right, bottom))
    
    # Resize to target size maintaining aspect ratio
    cropped.thumbnail((size, size), Image.Resampling.LANCZOS)
    
    # Create final square canvas
    final = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    
    # Paste cropped image centered
    final_x = (size - cropped.width) // 2
    final_y = (size - cropped.height) // 2
    final.paste(cropped, (final_x, final_y), cropped)
    
    # Optional: Add a subtle circular mask to preview how it looks in Android
    # (This is just for preview, Android will apply its own mask)
    
    # Save the icon
    final.save(output_path, 'PNG', optimize=True)
    print(f"✓ Created app icon: {output_path}")
    print(f"  Size: {size}x{size}px")
    print(f"  Safe zone: ~{int(size * 0.66)}px diameter (centered)")

if __name__ == '__main__':
    # Default paths
    input_file = 'assets/images/steps-icon-reference.png'  # User should replace this
    output_file = 'assets/images/app-icon-thumbnail.png'
    
    # Check if input file exists
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file not found: {input_file}")
        print("\nUsage:")
        print("  python create_app_icon.py <input_image.png> [output_icon.png]")
        print("\nExample:")
        print("  python create_app_icon.py steps-reference.png assets/images/app-icon-thumbnail.png")
        sys.exit(1)
    
    # Create output directory if needed
    os.makedirs(os.path.dirname(output_file) if os.path.dirname(output_file) else '.', exist_ok=True)
    
    # Create the icon
    create_circular_icon(input_file, output_file, size=1024)
    print(f"\n✓ Done! Update app.json to use: {output_file}")

