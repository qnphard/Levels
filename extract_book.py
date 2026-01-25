import zipfile
import os
from pathlib import Path
from bs4 import BeautifulSoup
import re

def extract_epub_text(epub_path, search_terms=None):
    """Extract text from epub, optionally filtering by search terms."""
    texts = []
    
    with zipfile.ZipFile(epub_path, 'r') as z:
        # Get all HTML/XHTML files
        html_files = [f for f in z.namelist() if f.endswith(('.html', '.xhtml', '.htm'))]
        html_files.sort()
        
        for html_file in html_files:
            content = z.read(html_file).decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            text = soup.get_text(separator='\n', strip=True)
            
            if search_terms:
                # Only include if any search term is found
                if any(term.lower() in text.lower() for term in search_terms):
                    texts.append(f"\n\n=== {html_file} ===\n\n{text}")
            else:
                texts.append(f"\n\n=== {html_file} ===\n\n{text}")
    
    return '\n'.join(texts)

# Find the Transcending book
books_dir = Path("Books/extracted")
for f in books_dir.iterdir():
    if "Transcending" in f.name:
        print(f"Found: {f.name}")
        
        # Extract chapters about Shame (Level 20)
        text = extract_epub_text(f, search_terms=["Shame", "Level 20", "calibration 20"])
        
        # Limit output
        if len(text) > 50000:
            text = text[:50000] + "\n\n... [TRUNCATED]"
        
        # Save to file for review
        output_path = Path(".gsd/SHAME_REFERENCE.md")
        with open(output_path, 'w', encoding='utf-8') as out:
            out.write(f"# Shame (Level 20) — Source Reference\n\n")
            out.write(f"Extracted from: {f.name}\n\n")
            out.write("---\n\n")
            out.write(text)
        
        print(f"Saved to {output_path}")
        break
