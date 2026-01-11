# Creating the App Icon from Steps Image

To use the uploaded steps image as your app icon/thumbnail:

## Option 1: Using Python Script (Recommended)

1. **Save the uploaded image** to your project:
   - Name it `steps-reference.png`
   - Place it in the project root or `assets/images/`

2. **Install Python PIL/Pillow** (if not already installed):
   ```bash
   pip install Pillow
   ```

3. **Run the cropping script**:
   ```bash
   python create_app_icon.py steps-reference.png assets/images/app-icon-thumbnail.png
   ```

4. **Update app.json** (already done below)

## Option 2: Manual Cropping

1. Open the steps image in an image editor
2. Crop it to 1024x1024px square
3. Center the diagonal steps within the frame
4. Ensure the steps are within the central ~66% of the image (Android's safe zone)
5. Save as `assets/images/app-icon-thumbnail.png`

## Notes

- Android adaptive icons crop to a circle, so important content should be in the center
- The in-app logo (`assets/images/levels-logo.png`) remains unchanged
- The new icon only affects the app thumbnail/icon shown on device home screens

