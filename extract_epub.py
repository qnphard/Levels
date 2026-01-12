import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
import sys
import os

def extract_epub_text(epub_path, output_path=None, max_chars=50000):
    """Extract text from epub file"""
    try:
        book = epub.read_epub(epub_path)
        text_parts = []
        
        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                soup = BeautifulSoup(item.get_content(), 'html.parser')
                text = soup.get_text(separator='\n', strip=True)
                if text:
                    text_parts.append(text)
        
        full_text = '\n\n'.join(text_parts)
        
        # Limit output
        if len(full_text) > max_chars:
            full_text = full_text[:max_chars] + "\n\n... [truncated]"
        
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(full_text)
            print(f"Extracted to {output_path}")
        else:
            print(full_text)
            
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_epub.py <epub_path> [output_path]")
        sys.exit(1)
    
    epub_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    extract_epub_text(epub_path, output_path)
