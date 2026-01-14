
import os

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\846c77d5-b930-41eb-8ad0-5212bf7533c0\shame_20_dossier.md"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

index_rant_start = -1
index_map_start = -1
index_movies_start = -1

for i, line in enumerate(lines):
    if index_rant_start == -1 and "Blame: The Philosophy, Psychology, and Politics" in line:
        index_rant_start = i
    if index_map_start == -1 and "Appendix B" in line and (i+1 < len(lines) and "Map of the Scale" in lines[i+1]):
        index_map_start = i
    if index_movies_start == -1 and "Appendix D" in line and (i+1 < len(lines) and "Movies" in lines[i+1]):
        index_movies_start = i

print(f"Rant Start: {index_rant_start}")
print(f"Map Start: {index_map_start}")
print(f"Movies Start: {index_movies_start}")

if index_rant_start != -1 and index_map_start != -1 and index_movies_start != -1:
    # Keep 0 to Rant Start
    part1 = lines[:index_rant_start]
    # Keep Map Start to Movies Start
    part2 = lines[index_map_start:index_movies_start]
    
    final_lines = part1 + part2
    
    # Prune trailing
    while final_lines and final_lines[-1].strip() == "":
        final_lines.pop()
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
    print(f"Pruned v2 complete. New line count: {len(final_lines)}")
else:
    print("Could not find all markers. Markers found:")
    print(f"Rant: {index_rant_start}")
    print(f"Map: {index_map_start}")
    print(f"Movies: {index_movies_start}")
