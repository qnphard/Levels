
import os
import re

base_dir = r'c:\Users\Admin\.gemini\antigravity\scratch\Levels\node_modules\@shopify\react-native-skia\src'

def patch_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    changed = False
    
    # Pattern to match: export * from "./something" or export { ... } from "./something"
    # and check if "./something" is a directory
    pattern = re.compile(r'(export\s+.*\s+from\s+["\'])(./[^"\']+)(["\'])')
    
    for line in lines:
        match = pattern.search(line)
        if match:
            prefix, path, suffix = match.groups()
            # Absolute path of the potentially exported thing
            abs_path = os.path.normpath(os.path.join(os.path.dirname(file_path), path))
            
            # If it's a directory and doesn't already have /index
            if os.path.isdir(abs_path) and not path.endswith('/index'):
                new_path = path + '/index'
                line = line.replace(path, new_path)
                changed = True
        
        new_lines.append(line)
    
    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Patched: {file_path}")

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            patch_file(os.path.join(root, file))

print("Comprehensive Skia patch complete.")
