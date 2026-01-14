
import os

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
files = [
    "transcending.txt",
    "letting_go.txt",
    "healing_recovery.txt",
    "truth_vs_falsehood.txt"
]

keywords = [
    "Grief", "Level 75", "Regret", "Sadness", "Despondency", "Mourning", "CHAPTER 4", "CHAPTER 5"
]

output_file = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\grief_locations.txt"

with open(output_file, 'w', encoding='utf-8') as outfile:
    for filename in files:
        outfile.write(f"--- Scanning {filename} ---\n")
        try:
            with open(os.path.join(base_path, filename), 'r', encoding='utf-8') as f:
                for i, line in enumerate(f):
                    line = line.strip()
                    if not line: continue
                    # Simple filter to avoid too much noise, but keep headers
                    if len(line) < 140: 
                        line_lower = line.lower()
                        for k in keywords:
                            if k.lower() in line_lower:
                                outfile.write(f"{filename}:{i+1}: {line}\n")
        except Exception as e:
            outfile.write(f"Error reading {filename}: {e}\n")

print("Grief location search complete.")
