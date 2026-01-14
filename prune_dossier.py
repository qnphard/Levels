
import os

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\846c77d5-b930-41eb-8ad0-5212bf7533c0\shame_20_dossier.md"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

index_a = -1
index_b = -1
index_c = -1

for i, line in enumerate(lines):
    if "Blame: The Philosophy, Psychology, and Politics" in line:
        index_a = i
    if "Appendix B" in line and (i+1 < len(lines) and "Map of the Scale" in lines[i+1]):
        index_b = i
    if "Appendix D" in line and (i+1 < len(lines) and "Movies" in lines[i+1]):
        index_c = i

print(f"Index A (Blame): {index_a}")
print(f"Index B (Appendix B): {index_b}")
print(f"Index C (Appendix D): {index_c}")

if index_a != -1 and index_b != -1 and index_c != -1:
    # Keep [Start ... Index A) + [Index B ... Index C)
    new_lines = lines[:index_a] + lines[index_b:index_c]
    
    # Prune trailing newlines
    while new_lines and new_lines[-1].strip() == "":
        new_lines.pop()

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Pruned file written. New line count: {len(new_lines)}")
else:
    print("Could not find all split points. Aborting.")
