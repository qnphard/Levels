
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
    ("transcending.txt", 900, 1071, "Chapter 4: Grief"),
    ("letting_go.txt", 2482, 2800, "Chapter 5: Grief"),
    ("healing_recovery.txt", 15491, 15550, "Grief (Map Description)"), 
    ("healing_recovery.txt", 11283, 11300, "Grief (Consciousness Aspect)"),
]

dossier_path = r"C:\Users\Admin\.gemini\antigravity\brain\846c77d5-b930-41eb-8ad0-5212bf7533c0\grief_75_dossier.md"
scratch_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\grief_75_dossier.md"

synthesis_content = """# Deep Dive Research Dossier: Level 75 - Grief

**Status:** Comprehensive Analysis & Raw Data
**Calibration Level:** 75
**Emotion:** Regret
**Process:** Despondency
**God-View:** Disdainful / Remote
**Life-View:** Tragic

> [!IMPORTANT]
> **Core Dynamic**: Grief is the state of loss, mourning, and regret. While it feels painful, it is higher energy than Apathy because there is *feeling* involved. The "I can't" of Apathy becomes the "I lost" of Grief. It is a necessary bridge back to life.

## 1. Synthesis & Analysis

### The Energy of Mourning
Grief (75) focuses on the past. It is the realm of "if only" and "what might have been." It is characterized by regret, sadness, and a sense of irretrievable loss. However, crying releases energy, making Grief more fluid and active than the solid, frozen state of Apathy.

### The Tragic View
At this level, life is seen as a series of tragedies. God is perceived as disdainful or remote—an entity that allows suffering and loss. The underlying belief is that happiness is external and has been removed, leading to despondency.

### Clinical Manifestations
*   **Depression vs. Sadness:** While Apathy is "dead" depression, Grief is "sad" depression. There is active emotional pain, crying, and mourning.
*   **Attachment:** Grief is fundamentally about attachment to things, people, or concepts. When the object of attachment is removed, the ego collapses into grief because it identified its happiness with the external object.
*   **Health:** Constant grief suppresses the immune system and ages the body prematurely.

### Transcendence Path
**Acceptance** and **Non-Attachment** are the keys.
1.  **Allowing the Grief:** Suppressed grief causes chronic depression. One must allow the grief to come up *without resisting it*. It is time-limited; if fully felt, it passes.
2.  **Recontextualizing Loss:** Realizing that the *source* of happiness is within, not in the lost object.
3.  **Surrender:** Letting go of the "if only" fantasies and accepting the reality of the present.

---

# EXTENDED RAW RESEARCH MATERIALS

"""

# Map extraction (reusing)
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

print("Grief dossier extraction complete.")
