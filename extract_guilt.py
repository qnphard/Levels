
import os

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
files = {
    "transcending.txt": "Transcending the Levels of Consciousness",
    "letting_go.txt": "Letting Go: The Pathway of Surrender",
    "healing_recovery.txt": "Healing and Recovery",
    "truth_vs_falsehood.txt": "Truth vs. Falsehood"
}

# Define extractions: (filename, start_line, end_line, label)
# 1-based line numbers from previous step
extractions = [
    ("transcending.txt", 605, 763, "Chapter 2: Guilt and Vindictive Hate"),
    ("letting_go.txt", 3241, 3420, "Guilt (Anatomy of Emotions)"),
    ("letting_go.txt", 7551, 7700, "Guilt (Major Section)"),
    ("healing_recovery.txt", 16930, 17200, "Unconscious Guilt"),
    ("healing_recovery.txt", 15451, 15600, "Guilt, Shame, and Apathy"),
]

output_file = r"C:\Users\Admin\.gemini\antigravity\brain\846c77d5-b930-41eb-8ad0-5212bf7533c0\guilt_30_dossier.md"

with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.write("# Deep Dive Research Dossier: Level 30 - Guilt\n")
    outfile.write("**Calibration Level:** 30\n")
    outfile.write("**Emotion:** Blame / Remorse\n")
    outfile.write("**Process:** Destruction\n")
    outfile.write("**God-View:** Vengeful\n")
    outfile.write("**Life-View:** Evil\n\n")
    
    outfile.write("> [!IMPORTANT]\n")
    outfile.write("> **Core Dynamic**: Guilt is used by the ego to maintain separation and alleviate fear of punishment by self-punishment. It is a tool of manipulation and control.\n\n")

    outfile.write("# EXTENDED RAW RESEARCH MATERIALS\n\n")

    for filename, start, end, label in extractions:
        path = os.path.join(base_path, filename)
        book_title = files.get(filename, filename)
        outfile.write(f"## {label}\n")
        outfile.write(f"**Source:** *{book_title}*\n\n")
        
        try:
            with open(path, 'r', encoding='utf-8') as infile:
                lines = infile.readlines()
                # Adjust for 0-based index
                chunk = lines[start-1:end]
                outfile.write("".join(chunk))
                outfile.write("\n\n---\n\n")
        except Exception as e:
            outfile.write(f"Error extracting {label}: {e}\n\n")

print("Guilt dossier extraction complete.")
