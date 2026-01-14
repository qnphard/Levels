
import os

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
files = [
    "transcending.txt",
    "letting_go.txt",
    "healing_recovery.txt",
    "truth_vs_falsehood.txt"
]

keywords = [
    "Desire", "Level 125", "Craving", "Addiction", "Alcoholism", "CHAPTER 6", "CHAPTER 7", "CHAPTER 8"
]

output_file = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\desire_locations.txt"

with open(output_file, 'w', encoding='utf-8') as outfile:
    for filename in files:
        outfile.write(f"--- Scanning {filename} ---\n")
        try:
            with open(os.path.join(base_path, filename), 'r', encoding='utf-8') as f:
                for i, line in enumerate(f):
                    line = line.strip()
                    if not line: continue
                    # Keyword check
                    line_lower = line.lower()
                    if any(k.lower() in line_lower for k in keywords):
                         # Limit line length to find headers/titles
                         if len(line) < 140:
                             outfile.write(f"{filename}:{i+1}: {line}\n")
        except Exception as e:
            outfile.write(f"Error reading {filename}: {e}\n")

print("Desire location search complete.")
