
import os

files = {
    "letting_go.txt": ["Apathy and Depression"],
    "healing_recovery.txt": ["Chapter 12  Depression"],
    "truth_vs_falsehood.txt": ["The Downside of Society"]
}

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"

for filename, search_terms in files.items():
    path = os.path.join(base_path, filename)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                for term in search_terms:
                    # Loose matching
                    if term.lower() in line.lower() and len(line) < 100:
                         print(f"MATCH: {filename} :: {i+1} :: {line.strip()}")
    except FileNotFoundError:
        pass
