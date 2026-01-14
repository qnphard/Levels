
import os

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
files = [
    "transcending.txt",
    "letting_go.txt",
    "healing_recovery.txt",
    "truth_vs_falsehood.txt"
]

keywords = [
    "Fear", "Level 100", "Anxiety", "Worry", "Panic", "CHAPTER 5", "CHAPTER 6", "CHAPTER 7"
]

output_file = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\fear_locations.txt"

with open(output_file, 'w', encoding='utf-8') as outfile:
    for filename in files:
        outfile.write(f"--- Scanning {filename} ---\n")
        try:
            with open(os.path.join(base_path, filename), 'r', encoding='utf-8') as f:
                for i, line in enumerate(f):
                    line = line.strip()
                    if not line: continue
                    if len(line) < 140: 
                        line_lower = line.lower()
                        for k in keywords:
                            if k.lower() in line_lower:
                                outfile.write(f"{filename}:{i+1}: {line}\n")
        except Exception as e:
            outfile.write(f"Error reading {filename}: {e}\n")

print("Fear location search complete.")
