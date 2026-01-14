import os
import shutil

SOURCE_DIR = r"C:\Users\Admin\Desktop\Books"

mapping = {
    "Healing and Recovery": "healing_recovery.pdf",
    "Letting Go": "letting_go.pdf",
    "Power vs_ Force": "power_vs_force.azw3",
    "Transcending the levels": "transcending.epub",
    "Truth Vs_ Falsehood": "truth_vs_falsehood.epub"
}

files = os.listdir(SOURCE_DIR)
for f in files:
    for key, new_name in mapping.items():
        if key in f:
            old_path = os.path.join(SOURCE_DIR, f)
            new_path = os.path.join(SOURCE_DIR, new_name)
            # Check if extension matches to be safe (some might have different ext)
            if not f.endswith(os.path.splitext(new_name)[1]):
                 # If extension mismatch, skip or adjust? 
                 # 'Power vs Force' is azw3. 'Transcending' is epub. 'Truth' is epub.
                 # 'Healing' is pdf. 'Letting Go' is pdf.
                 if "Power vs_ Force" in f and f.endswith(".azw3"):
                     pass
                 elif "Transcending" in f and f.endswith(".epub"):
                     pass
                 elif "Truth" in f and f.endswith(".epub"):
                     pass
                 elif "Letting Go" in f and f.endswith(".pdf"):
                    pass
                 elif "Healing" in f and f.endswith(".pdf"):
                    pass
                 else:
                    continue # Skip if extension doesn't match what we expect for that keyword
            
            try:
                os.rename(old_path, new_path)
                print(f"Renamed '{f}' to '{new_name}'")
            except Exception as e:
                print(f"Error renaming {f}: {e}")
