
import os

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
files = {
    "transcending.txt": "Transcending the Levels of Consciousness",
    "letting_go.txt": "Letting Go: The Pathway of Surrender",
    "healing_recovery.txt": "Healing and Recovery",
    "truth_vs_falsehood.txt": "Truth vs. Falsehood"
}

# Define extractions: (filename, start_line, end_line, label)
# 1-based line numbers from location txt
extractions = [
    ("transcending.txt", 763, 900, "Chapter 3: Apathy"),
    ("letting_go.txt", 1893, 2250, "Apathy and Depression"),
    ("healing_recovery.txt", 15451, 15600, "Guilt, Shame, and Apathy"), # Contextual
]

dossier_path = r"C:\Users\Admin\.gemini\antigravity\brain\846c77d5-b930-41eb-8ad0-5212bf7533c0\apathy_50_dossier.md"
scratch_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\apathy_50_dossier.md"

synthesis_content = """# Deep Dive Research Dossier: Level 50 - Apathy

**Status:** Comprehensive Analysis & Raw Data
**Calibration Level:** 50
**Emotion:** Despair
**Process:** Abdication
**God-View:** Condemning
**Life-View:** Hopeless

> [!IMPORTANT]
> **Core Dynamic**: Apathy is the state of "I can't". It is total resignation, hopelessness, and giving up the will to live. It is less active than Guilt (which self-attacks) and is characterized by a "living death" or catatonia.

## 1. Synthesis & Analysis

### The Energy of Abdication
Apathy (50) is the state of utter defeat. The poverty of spirit is absolute. Unlike Guilt, which has the "juice" of blaming oneself, Apathy has no energy left even for that. It is the realm of the homeless, the destitute, and the catatonic. The will to live is gone.

### The Condemning God
At level 50, God is perceived as having abandoned the soul. The view is not just that God is angry (as in Guilt), but that God has condemned and turned away. The individual feels totally forsaken.

### Clinical Manifestations
*   **Depression:** Severe, immobilizing depression. Not just "the blues" (which is often Grief), but a comatose-like state of non-functioning.
*   **Victimhood:** Total learned helplessness. The belief that "no one can help me" and "nothing can be done."
*   **Poverty:** This level is drawn to poverty in all forms—financial, social, and spiritual. It attracts failure because it radiates "I can't."

### Transcendence Path
**Motivation** is the difficult first step out of Apathy.
1.  **Anger as Fuel**: Interestingly, moving from Apathy to Anger is a HUGE leap forward. Anger means one cares enough to be mad. Apathy cares about nothing.
2.  **Service**: Sometimes, doing something for others (even a pet) is the only spark that can reignite the will to live when self-preservation has failed.
3.  **Surrender**: Admitting "I can't" but adding "but God can." Surrendering the *resistance* to the despair, rather than the despair itself.

---

# EXTENDED RAW RESEARCH MATERIALS

"""

# Extract Map from TvF (reusing logic or hardcoding standard location if known, 
# but for now I'll just append a placeholder or try the same search)
tvf_path = os.path.join(base_path, "truth_vs_falsehood.txt")
map_content = ""
try:
    with open(tvf_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        start = -1
        end = -1
        for i, line in enumerate(lines):
            if "Appendix B" in line and "Map" in line:
                start = i
            if start != -1 and "Appendix C" in line:
                end = i
                break
        
        if start != -1 and end != -1:
            map_content = "\n\n## Appendix: Map of the Scale of Consciousness\n**Source:** *Truth vs. Falsehood*\n\n" + "".join(lines[start:end])
except:
    pass

with open(scratch_path, 'w', encoding='utf-8') as outfile:
    outfile.write(synthesis_content)
    
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

    outfile.write(map_content)

# Also copy to brain
import shutil
shutil.copy(scratch_path, dossier_path)

print("Apathy dossier extraction complete.")
