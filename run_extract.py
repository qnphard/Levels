import os
import sys
from extract_epub import extract_epub_text

search_dir = r"C:\Users\Admin\Desktop\Books"
output_file = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\transcending_extracted.txt"

files = os.listdir(search_dir)
target_file = None
for f in files:
    if "Transcending the levels of consciousness" in f and f.endswith(".epub"):
        target_file = os.path.join(search_dir, f)
        break

if target_file:
    print(f"Found file: {target_file}")
    extract_epub_text(target_file, output_file)
else:
    print("File not found")
