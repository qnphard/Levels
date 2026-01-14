
import os

files = [
    "letting_go.txt",
    "healing_recovery.txt",
    "truth_vs_falsehood.txt"
]
base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"

keywords = ["Guilt", "Level 30", "CHAPTER 2", "CHAPTER 3", "CHAPTER 4", "Self-Condemnation", "Punishment"]

for filename in files:
    print(f"--- Scanning {filename} ---")
    try:
        with open(os.path.join(base_path, filename), 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                line = line.strip()
                if not line: continue
                # simple check for keywords in headings (assuming headings are short-ish)
                if len(line) < 100:
                    for k in keywords:
                        if k.lower() in line.lower():
                            if "guilt" in line.lower() or "30" in line.lower() or "chapter" in line.lower():
                                print(f"{filename}:{i+1}: {line}")
    except Exception as e:
        print(f"Error reading {filename}: {e}")
