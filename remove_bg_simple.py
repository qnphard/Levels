from rembg import remove
from PIL import Image

# Load and process
input_image = Image.open('UI/App thumbnail.png')
output_image = remove(input_image)

# Save
output_image.save('assets/images/logo-no-bg.png')
print("Background removed successfully!")
print("Saved to: assets/images/logo-no-bg.png")
