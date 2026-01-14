
import os
import shutil

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

# 1. Transcending: Chapter 5 -> Chapter 6
# Markers: CHAPTER 5 / CHAPTER 6
def t_start(line): return "CHAPTER 5" in line and len(line) < 80
def t_end(line): return "CHAPTER 6" in line and len(line) < 80

s, e, lines = find_chapter_range("transcending.txt", t_start, t_end, start_hint=1000)
if s != -1:
    extractions.append(("transcending.txt", s, e, "Chapter 5: Fear", lines))

# 2. Letting Go: FEAR -> DESIRE
# Markers: FEAR / DESIRE (Uppercase, short lines)
def l_start(line): return "FEAR" in line and len(line.strip()) < 10 and line.strip() == "FEAR"
def l_end(line): return "DESIRE" in line and len(line.strip()) < 20 and "DESIRE" in line.upper()

# Note: The previous run included "CHAPTER" and "7". I'll try to stop at "CHAPTER" if followed by 7, but "DESIRE" is safer as a hard stop.
# Actually, let's stop at "CHAPTER" if possible.
def l_end_robust(line): return "CHAPTER" in line and len(line) < 20

s, e, lines = find_chapter_range("letting_go.txt", l_start, l_end, start_hint=2800)
if s != -1:
    extractions.append(("letting_go.txt", s, e, "Chapter 6: Fear", lines))

# 3. Healing and Recovery
# Markers: "WORRY, FEAR, AND ANXIETY" -> "PAIN AND SUFFERING"
def h_start(line): return "WORRY" in line.upper() and "FEAR" in line.upper() and "ANXIETY" in line.upper() and len(line) < 100
def h_end(line): return "PAIN" in line.upper() and "SUFFERING" in line.upper() and len(line) < 100

s, e, lines = find_chapter_range("healing_recovery.txt", h_start, h_end, start_hint=10300)
if s != -1:
    extractions.append(("healing_recovery.txt", s, e, "Chapter 9: Worry, Fear, and Anxiety", lines))

# Dossier Construction
dossier_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\fear_100_dossier.md"

synthesis_content = """# Deep Dive Research Dossier: Level 100 - Fear

**Status:** Comprehensive Analysis & Raw Data
**Calibration Level:** 100
**Emotion:** Anxiety
**Process:** Withdrawal
**God-View:** Punitive / Frightening
**Life-View:** Frightening

> [!IMPORTANT]
> **Core Dynamic**: Fear is the "Danger" signal. It is much higher energy than Apathy or Grief because it mobilizes energy (fight or flight). However, in the chronic state, it leads to paranoia, anxiety disorders, and a shrinking of life.

## 1. Synthesis & Analysis

### The Energy of Anxiety
Fear (100) perceives the world as dangerous. The focus moves from the past (Grief) to the future (Worry). "What if?" is the mantra. Fear proliferates: fear of one thing leads to fear of another, eventually leading to "Fear of Fear" itself.

### The Punitive God
At Level 100, God is seen as a punisher. Sin and guilt (from lower levels) project onto God, creating a fear of retribution, hell, and judgment.

### Clinical Manifestations
*   **Anxiety & Panic:** Chronic activation of the stress response (cortisol/adrenaline).
*   **Projection:** We project our inner fear onto the world, seeing enemies everywhere (e.g., germs, muggers, terrorists).
*   **Control:** Fear drives a need for control to assuage the anxiety.

### Transcendence Path
**Courage** (200) is the goal, but **Desire** (125) and **Anger** (150) are the steps.
1.  **Stop Fearing Fear:** Understand that fear is just a feeling and not a fact.
2.  **Love as Antidote:** "Perfect love casteth out fear." Focusing on loving others or a pet can bypass the fear circuit.
3.  **Action:** Doing the thing you fear (Courage) desensitizes the ego to the threat.

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

print("Fear dossier extraction V3 complete. Extracted: " + str(len(extractions)) + " sections.")
