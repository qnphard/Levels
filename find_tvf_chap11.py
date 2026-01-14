
import os

filename = "truth_vs_falsehood.txt"
base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
path = os.path.join(base_path, filename)

try:
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            if "Chapter 11" in line or "The Downside of Society" in line:
                # Print context to verify
                print(f"Line {i+1}: {line.strip()}")
                if i + 5 < len(lines):
                    print(f"   Context: {lines[i+1].strip()} {lines[i+2].strip()}")
except Exception as e:
    print(e)
