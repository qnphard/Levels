
import os

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
files = {
    "transcending.txt": "Transcending the Levels of Consciousness",
    "letting_go.txt": "Letting Go: The Pathway of Surrender",
    "healing_recovery.txt": "Healing and Recovery",
    "truth_vs_falsehood.txt": "Truth vs. Falsehood"
}

def find_chapter_range(filename, start_func, end_func, start_hint=0):
    path = os.path.join(base_path, filename)
    start_line = -1
    end_line = -1
    
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
        # Find start
        for i, line in enumerate(lines):
            if i < start_hint: continue
            if start_func(line):
                start_line = i
                break
        
        if start_line != -1:
            # Find end
            for i, line in enumerate(lines):
                if i <= start_line + 5: continue
                if end_func(line):
                    end_line = i
                    break
            if end_line == -1:
                end_line = len(lines)
                
    return start_line, end_line, lines

extractions = []

# 1. Transcending: Chapter 8
def t_start(line): return "CHAPTER 8" in line and len(line) < 50
def t_end(line): return "CHAPTER 9" in line and len(line) < 50

s, e, lines = find_chapter_range("transcending.txt", t_start, t_end, start_hint=1400)
if s != -1:
    extractions.append(("transcending.txt", s, e, "Chapter 8: Pride", lines))

# 2. Letting Go: Chapter 9: Pride
# Start: "PRIDE" around line 4253
# End: "COURAGE" or "CHAPTER" around line 4670 (Chapter 10 is Courage)
def l_start(line): return "PRIDE" == line.strip()
def l_end(line): return "COURAGE" == line.strip() or ("Chapter" in line and "10" in line)

s, e, lines = find_chapter_range("letting_go.txt", l_start, l_end, start_hint=4200)
if s != -1:
    extractions.append(("letting_go.txt", s, e, "Chapter 9: Pride", lines))

# 3. Healing and Recovery Concordance
hr_concordance = []
hr_path = os.path.join(base_path, "healing_recovery.txt")
with open(hr_path, 'r', encoding='utf-8') as f:
    para = []
    for line in f:
        if line.strip() == "":
            if para:
                text = "".join(para)
                lower_text = text.lower()
                if ("pride" in lower_text or "arrogance" in lower_text or "scorn" in lower_text or "inflation" in lower_text) and len(text) > 200:
                    hr_concordance.append(text)
                para = []
        else:
            para.append(line)

# Dossier Construction
dossier_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\pride_175_dossier.md"

synthesis_content = """# Deep Dive Research Dossier: Level 175 - Pride

**Status:** Comprehensive Analysis & Raw Data
**Calibration Level:** 175
**Emotion:** Scorn
**Process:** Inflation
**God-View:** Indifferent
**Life-View:** Demanding

> [!IMPORTANT]
> **Core Dynamic**: Pride is the last hurdle before the critical crossover at 200 (Power). It feels good ("I am better than you") compared to lower levels, but it is brittle. It depends on external conditions (status, wealth, opinion) and is constantly defensive.

## 1. Synthesis & Analysis

### The Trap of "Better Than"
Pride builds a fortress of "I know." Intellectual pride ("I am right, you are wrong") and spiritual pride ("I am saved, you are lost") are massive blocks to growth.
*   **Vulnerability**: Because Pride depends on external validation or a self-image, it can be knocked down easily. "Pride goeth before a fall."
*   **Denial**: The main mechanism of Pride is denial. It refuses to see its own shadow or mistakes.

### The Indifferent God
At 175, God is seen as indifferent or as "My God" (who favors my tribe/nation/team). It is a divisive view.

### Transcendence Path
**Move to Courage (200)**.
1.  **Humility**: The antidote to Pride. Admitting "I could be wrong" or "I don't know."
2.  **Surrender**: Giving up the need to be right.
3.  **Gratitude**: Replacing "I did this" with "I am grateful this happened through me."

---

# EXTENDED RAW RESEARCH MATERIALS

"""

# Appendix Map
tvf_path = os.path.join(base_path, "truth_vs_falsehood.txt")
map_content = ""
try:
    with open(tvf_path, 'r', encoding='utf-8') as f:
        tvf_lines = f.readlines()
        start = -1
        end = -1
        for i, line in enumerate(tvf_lines):
            if "Appendix B" in line and "Map" in line:
                start = i
            if start != -1 and "Appendix C" in line:
                end = i
                break
        
        if start != -1 and end != -1:
            map_content = "\n\n## Appendix: Map of the Scale of Consciousness\n**Source:** *Truth vs. Falsehood*\n\n" + "".join(tvf_lines[start:end])
except:
    pass

with open(dossier_path, 'w', encoding='utf-8') as outfile:
    outfile.write(synthesis_content)
    
    for filename, start, end, label, lines in extractions:
        book_title = files.get(filename, filename)
        outfile.write(f"## {label}\n")
        outfile.write(f"**Source:** *{book_title}*\n\n")
        outfile.write("".join(lines[start:end]))
        outfile.write("\n\n---\n\n")

    if hr_concordance:
        outfile.write("## Selected Wisdom on Pride & Arrogance\n")
        outfile.write("**Source:** *Healing and Recovery*\n\n")
        for p in hr_concordance[:30]: 
            outfile.write(p.strip() + "\n\n***\n\n")

    outfile.write(map_content)

print("Pride dossier extraction complete.")
