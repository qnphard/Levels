
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

# 1. Transcending: Chapter 7: Anger
def t_start(line): return "CHAPTER 7" in line and len(line) < 50
def t_end(line): return "CHAPTER 8" in line and len(line) < 50

s, e, lines = find_chapter_range("transcending.txt", t_start, t_end, start_hint=1300)
if s != -1:
    extractions.append(("transcending.txt", s, e, "Chapter 7: Anger", lines))

# 2. Letting Go: Chapter 8: Anger
# Use robust markers.
# Start: "ANGER" line around 3864
# End: "PRIDE" or "CHAPTER" around line 4500
def l_start(line): return "ANGER" == line.strip()
def l_end(line): return "PRIDE" == line.strip()

s, e, lines = find_chapter_range("letting_go.txt", l_start, l_end, start_hint=3800)
if s != -1:
    extractions.append(("letting_go.txt", s, e, "Chapter 8: Anger", lines))
else:
    # Fallback if exact match fails
    def l_start_f(line): return "Chapter" in line and "8" in line and "Anger" in line
    def l_end_f(line): return "Chapter" in line and "9" in line
    s, e, lines = find_chapter_range("letting_go.txt", l_start_f, l_end_f, start_hint=100)
    if s != -1:
        extractions.append(("letting_go.txt", s, e, "Chapter 8: Anger (Fallback)", lines))


# 3. Healing and Recovery Concordance
# Since there is no dedicated chapter, we'll extract paragraph blocks containing "Anger" or "Resentment"
hr_concordance = []
hr_path = os.path.join(base_path, "healing_recovery.txt")
with open(hr_path, 'r', encoding='utf-8') as f:
    para = []
    for line in f:
        if line.strip() == "":
            if para:
                text = "".join(para)
                if ("anger" in text.lower() or "resentment" in text.lower()) and len(text) > 200:
                    hr_concordance.append(text)
                para = []
        else:
            para.append(line)

# Dossier Construction
dossier_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\anger_150_dossier.md"

synthesis_content = """# Deep Dive Research Dossier: Level 150 - Anger

**Status:** Comprehensive Analysis & Raw Data
**Calibration Level:** 150
**Emotion:** Hate
**Process:** Aggression
**God-View:** Vengeful
**Life-View:** Antagonistic

> [!IMPORTANT]
> **Core Dynamic**: Anger is the energy of "I want to change this." It is explosive and mobilizing. While destructive if chronic (resentment), it is higher than Apathy or Grief because it contains the energy for action and change.

## 1. Synthesis & Analysis

### The Energy of Action
Anger arises when a desire (Level 125) is frustrated. "I want X, I can't have X, therefore I am angry."
*   **Constructive Use**: Anger can lead to action. The oppressed rise up out of apathy *through* anger to seek freedom.
*   **Destructive Use**: Resentment ("stewing"), hatred, and revenge. These corrode the vessel (the self).

### The Vengeful God
At 150, God is seen as the "God of War" or a vengeful deity who punishes "sinners" with eternity in hell. This creates a justified self-righteousness in the believer ("righteous indignation").

### Clinical Manifestations
*   **Hypertension & Heart Disease**: Chronic unexpressed anger is physically toxic.
*   **"Righteous Indignation"**: The ego's favorite drug. Feeling "right" and making others "wrong" gives a temporary high (pumping up the ego).
*   **Projection**: "They" are the enemy. The world is seen as a battlefield.

### Transcendence Path
**Move to Pride (175) or Courage (200)**.
1.  **Ownership**: Admit "I am angry" rather than "They made me angry."
2.  **Surrender the Payoff**: Give up the "juice" of feeling misunderstood or victimized.
3.  **Acceptance**: Accept that people are who they are. "A tiger eats meat; it's not personal."

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
        outfile.write("## Selected Wisdom on Anger & Resentment\n")
        outfile.write("**Source:** *Healing and Recovery*\n\n")
        # Write top 20 most relevant/longest paragraphs to avoid noise
        # Sort by length as a proxy for substance? Or just take them.
        # Let's just write them all but separated.
        for p in hr_concordance[:30]: 
            outfile.write(p.strip() + "\n\n***\n\n")

    outfile.write(map_content)

print("Anger dossier extraction complete.")
