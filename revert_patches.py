
import os
import re

TARGET_LIBS = [
    r'c:\Users\Admin\.gemini\antigravity\scratch\Levels\node_modules\@shopify\react-native-skia\src',
    r'c:\Users\Admin\.gemini\antigravity\scratch\Levels\node_modules\react-native-reanimated\src'
]

def revert_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return
    
    # Replace "/index" with "" in our targeted patterns
    new_content = re.sub(r'((?:export|import)\s+.*\s+from\s+["\'](./[^"\']+))/index(["\'])', r'\1\3', content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Reverted: {file_path}")

for base_dir in TARGET_LIBS:
    if not os.path.exists(base_dir):
        continue
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                revert_file(os.path.join(root, file))

print("Revert complete.")
