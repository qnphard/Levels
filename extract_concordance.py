
import os
import re

base_path = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"
files = [
    "letting_go.txt",
    "healing_recovery.txt",
    "truth_vs_falsehood.txt",
    "transcending.txt"
]

keywords = [
    "shame", "humiliation", "despair", "suicide", "self-hatred", 
    "self hatred", "elimination", "level 20", "calibrates at 20", 
    "calibrate at 20", "depression", "miserable", "worthless"
]

output_file = r"C:\Users\Admin\.gemini\antigravity\brain\846c77d5-b930-41eb-8ad0-5212bf7533c0\shame_concordance.md"

def get_paragraphs(text):
    # Split by double newlines to emulate paragraphs
    return re.split(r'\n\s*\n', text)

with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.write("# CONCORDANCE OF SHAME, DESPAIR, AND SELF-DESTRUCTION\n")
    outfile.write("Extracted paragraphs containing keywords: " + ", ".join(keywords) + "\n\n")

    for filename in files:
        path = os.path.join(base_path, filename)
        outfile.write(f"## From {filename}\n\n")
        try:
            with open(path, 'r', encoding='utf-8') as infile:
                content = infile.read()
                paragraphs = get_paragraphs(content)
                
                for p in paragraphs:
                    p_lower = p.lower()
                    if any(k in p_lower for k in keywords):
                        # Clean up the paragraph a bit
                        p_clean = p.strip()
                        if len(p_clean) > 50: # Skip tiny snippets
                            outfile.write(f"> {p_clean}\n\n")
                            outfile.write("---\n\n")
        except Exception as e:
            outfile.write(f"Error reading {filename}: {e}\n")

print("Concordance extraction complete.")
