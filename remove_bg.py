from PIL import Image
import numpy as np

# Load the image
img = Image.open('UI/App thumbnail.png').convert('RGBA')
data = np.array(img)

# Get the image dimensions
height, width = data.shape[:2]

# Create a mask for pixels to keep
# We'll detect the rounded rectangle by finding the area that's not the outer background
# The outer background is very light gray/white

# Convert to separate channels
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Detect the very light background (close to #F5F5F5 or similar)
# We want to make this transparent
outer_bg_mask = (r > 240) & (g > 240) & (b > 240)

# Find the bounding box of the content (the rounded rectangle)
# Look for pixels that are NOT the outer background
content_rows = np.where(~outer_bg_mask.all(axis=1))[0]
content_cols = np.where(~outer_bg_mask.all(axis=0))[0]

if len(content_rows) > 0 and len(content_cols) > 0:
    top = content_rows[0]
    bottom = content_rows[-1]
    left = content_cols[0]
    right = content_cols[-1]

    # Add small padding
    padding = 10
    top = max(0, top - padding)
    bottom = min(height, bottom + padding)
    left = max(0, left - padding)
    right = min(width, right + padding)

    # Crop to the rounded rectangle
    cropped = data[top:bottom, left:right]

    # Make only the OUTER background transparent (not the white rectangle)
    # The white rectangle has subtle shadows/edges, so we detect the pure outer background
    # which is lighter and more uniform than the white rectangle
    outer_mask = (cropped[:,:,0] > 248) & (cropped[:,:,1] > 248) & (cropped[:,:,2] > 248)

    # Only make pixels transparent if they're on the edges (not inside the rounded rectangle)
    # We'll use a flood fill approach from the corners
    from scipy import ndimage
    # Start from corners and fill the outer area
    corner_value = (cropped[0,0,0] > 248) and (cropped[0,0,1] > 248) and (cropped[0,0,2] > 248)
    if corner_value:
        # Use a simple edge detection: outer background is very uniform
        gray = cropped[:,:,0] * 0.299 + cropped[:,:,1] * 0.587 + cropped[:,:,2] * 0.114
        outer_only = outer_mask.copy()

        # Find the bounding box of the white rectangle (it has shadows/anti-aliasing)
        # The outer background is more pure white
        for i in range(cropped.shape[0]):
            for j in range(cropped.shape[1]):
                if cropped[i,j,0] < 248 or cropped[i,j,1] < 248 or cropped[i,j,2] < 248:
                    # Hit the content or shadow, stop making transparent
                    outer_only[i:,j:] = False
                    break

        cropped[:,:,3][outer_mask] = 0

    # Create new image
    result = Image.fromarray(cropped, 'RGBA')

    # Save
    result.save('assets/images/logo-no-bg.png')
    print(f"Background removed! Cropped from {width}x{height} to {right-left}x{bottom-top}")
    print("Saved to: assets/images/logo-no-bg.png")
else:
    print("Could not detect content boundaries")
