
import os

files = {
    "letting_go.txt": [
        "Chapter 4",
        "Apathy and Depression",
        "Chapter 5",
        "Grief"
    ],
    "healing_recovery.txt": [
        "Chapter 12",
        "Depression",
        "Chapter 13",
        "Mental Illness"
    ],
    "truth_vs_falsehood.txt": [
        "Chapter 11",
        "The Downside of Society",
        "Chapter 12",
        "Problematic Issues"
    ]
}

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"

for filename, search_terms in files.items():
    path = os.path.join(base_path, filename)
    print(f"\nScanning {filename}...")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                for term in search_terms:
                    # Check for exact chapter headings often formatted like "Chapter 4" or having the title
                    if term.lower() in line.lower(): 
                         # Print only if it looks like a header (short length) or we can just print all matches to be safe
                         if len(line.strip()) < 100:
                            print(f"  Line {i+1}: {line.strip()}")
                            with open("chapter_lines.txt", "a") as out_f:
                                out_f.write(f"{filename} Line {i+1}: {line.strip()}\n")
    except FileNotFoundError:
        print(f"  File not found: {path}")
