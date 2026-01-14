import os
import sys
import glob
from ebooklib import epub
import ebooklib
from bs4 import BeautifulSoup
from pdfminer.high_level import extract_text as extract_pdf_text

SOURCE_DIR = r"C:\Users\Admin\Desktop\Books"
OUTPUT_DIR = r"C:\Users\Admin\.gemini\antigravity\scratch\Levels\research_materials"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def extract_epub(path):
    try:
        book = epub.read_epub(path)
        text_parts = []
        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                soup = BeautifulSoup(item.get_content(), 'html.parser')
                text = soup.get_text(separator='\n', strip=True)
                if text:
                    text_parts.append(text)
        return "\n\n".join(text_parts)
    except Exception as e:
        return f"Error extracting EPUB: {e}"

def extract_pdf(path):
    try:
        return extract_pdf_text(path)
    except Exception as e:
        return f"Error extracting PDF: {e}"

files = os.listdir(SOURCE_DIR)
for f in files:
    full_path = os.path.join(SOURCE_DIR, f)
    output_filename = os.path.splitext(f)[0] + ".txt"
    # Clean filename of weird chars
    output_filename = "".join([c for c in output_filename if c.isalnum() or c in (' ', '.', '-', '_')]).strip()
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    if os.path.exists(output_path):
        print(f"Skipping {f}, already extracted.")
        continue

    print(f"Processing: {f}")
    content = ""
    
    if f.lower().endswith(".epub"):
        content = extract_epub(full_path)
    elif f.lower().endswith(".pdf"):
        content = extract_pdf(full_path)
    else:
        print(f"Skipping format: {f}")
        continue

    if content:
        with open(output_path, "w", encoding="utf-8") as out:
            out.write(content)
        print(f"Saved to {output_path}")
