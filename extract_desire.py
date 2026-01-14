
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

# 1. Transcending: Chapter 6 -> Chapter 7
def t_start(line): return "CHAPTER 6" in line and len(line) < 50
def t_end(line): return "CHAPTER 7" in line and len(line) < 50

s, e, lines = find_chapter_range("transcending.txt", t_start, t_end, start_hint=1000)
if s != -1:
    extractions.append(("transcending.txt", s, e, "Chapter 6: Desire", lines))

# 2. Letting Go: DESIRE -> ANGER
def l_start(line): return "DESIRE" in line and len(line.strip()) < 10 and line.strip() == "DESIRE"
def l_end(line): return "ANGER" in line and len(line.strip()) < 10 and line.strip() == "ANGER"

s, e, lines = find_chapter_range("letting_go.txt", l_start, l_end, start_hint=3400)
if s != -1:
    extractions.append(("letting_go.txt", s, e, "Chapter 7: Desire", lines))

# 3. Healing and Recovery: ALCOHOLISM -> CANCER
def h_start(line): return "ALCOHOLISM" in line and len(line.strip()) < 20
def h_end(line): return "CANCER" in line and len(line.strip()) < 20

s, e, lines = find_chapter_range("healing_recovery.txt", h_start, h_end, start_hint=15000)
if s != -1:
    extractions.append(("healing_recovery.txt", s, e, "Chapter 13: Alcoholism (Addiction)", lines))

# Dossier Construction
dossier_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\desire_125_dossier.md"

synthesis_content = """# Deep Dive Research Dossier: Level 125 - Desire

**Status:** Comprehensive Analysis & Raw Data
**Calibration Level:** 125
**Emotion:** Craving
**Process:** Enslavement
**God-View:** Denying
**Life-View:** Disappointing

> [!IMPORTANT]
> **Core Dynamic**: Desire is the energy of "wanting" rather than "having." It is driven by the illusion of lack. It is a "Hungry Ghost" state—insatiable. The very act of desiring affirms that you do *not* have, pushing the object of desire away.

## 1. Synthesis & Analysis

### The Trap of "I Want"
Desire (125) is higher energy than Fear (100) because it motivates action. However, it is still a negative state because it is based on the premise of insufficiency.
*   **The Impossible Equation**: "I will be happy *when* I get X." This places happiness always in the future, making the present moment dissatisfied.
*   **Enslavement**: We become slaves to our cravings—money, sex, power, recognition. The object of desire controls us.

### Addiction Mechanism
All addictions calibrate at 125 (unless in the desperation phase, which is lower).
*   **The "Glamour"**: We do not desire the object itself, but the *feeling* we think the object will give us. We project a "glamour" onto the object (e.g., the car, the person, the drug).
*   **Relief, not Joy**: Fulfilling a desire brings only temporary relief from the pain of wanting, not true joy. The craving returns quickly.

### Transcendence Path
**Surrender the Wanting**: The paradox is that we get what we want only when we stop *needing* it.
1.  **Shift Context**: Realize that happiness is internal, not external.
2.  **Let go of the Attachment**: "I would like it, but I don't *need* it to be okay."
3.  **Appreciation**: Move from "wanting" (125) to "valuing/appreciating" (higher levels).

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

    outfile.write(map_content)

print("Desire dossier extraction complete. Extracted: " + str(len(extractions)) + " sections.")
