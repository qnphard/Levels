
import os

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
output_file = r"C:\Users\Admin\.gemini\antigravity\brain\846c77d5-b930-41eb-8ad0-5212bf7533c0\shame_20_dossier.md"

extractions = [
    {
        "file": "letting_go.txt",
        "ranges": [(771, 2478)],
        "label": "From 'Letting Go': Chapters 2, 3, and 4 (Mechanism, Anatomy of Emotions, Apathy & Depression)"
    },
    {
        "file": "healing_recovery.txt",
        "ranges": [(14146, 15366)],
        "label": "From 'Healing and Recovery': Chapter 12: Depression"
    },
    {
        "file": "truth_vs_falsehood.txt",
        "ranges": [(3640, 4427), (8013, 8200)],
        "label": "From 'Truth vs Falsehood': Chapters 11 & 12 (Downside of Society, Problematic Issues) and Appendix B (Map)"
    }
]

with open(output_file, 'a', encoding='utf-8') as outfile:
    outfile.write("\n\n# EXTENDED RAW RESEARCH MATERIALS\n\n")
    
    for task in extractions:
        path = os.path.join(base_path, task["file"])
        outfile.write(f"## {task['label']}\n\n")
        try:
            with open(path, 'r', encoding='utf-8') as infile:
                lines = infile.readlines()
                for start, end in task["ranges"]:
                    # Adjust for 0-based index
                    chunk = lines[start-1:end]
                    outfile.write("".join(chunk))
                    outfile.write("\n\n---\n\n")
        except Exception as e:
            outfile.write(f"Error extracting from {task['file']}: {e}\n")
            print(f"Error extracting from {task['file']}: {e}")

print("Extraction complete.")
