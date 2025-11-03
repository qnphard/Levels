import { useState, useEffect, useMemo } from 'react';
import { markdownContentMap } from '../assets/feelings/markdownContent';

export interface ParsedSection {
  id: string; // anchor-friendly ID
  title: string; // section title
  level: number; // 1 for H1, 2 for H2, 3 for H3
  rawContent: string;
}

export interface ParsedChapter {
  content: string;
  title: string;
  summary: string;
  sections: ParsedSection[];
}

// Simple markdown parser to extract title, summary, and sections
function parseMarkdown(markdown: string): ParsedChapter {
  const lines = markdown.split('\n');
  let title = '';
  let summary = '';
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const sectionTitle = trimmedLine.substring(2);
      const id = sectionTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      currentSection = {
        id,
        title: sectionTitle,
        level: 1,
        rawContent: '',
      };
      if (!title) {
        title = sectionTitle;
      }
    } else if (currentSection) {
      currentSection.rawContent += line + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }
  
  if (sections.length > 0) {
    const firstSectionContent = sections[0].rawContent.trim();
    if (firstSectionContent) {
        summary = firstSectionContent.substring(0, 200);
        if (summary.length < firstSectionContent.length) {
            summary += '...';
        }
    }
  }

  if (!summary) {
    summary = 'Learn about how emotions work and why they return.';
  }

  return {
    content: markdown,
    title: title || 'Chapter',
    summary,
    sections,
  };
}

// Cache for parsed chapters
const parseCache: Record<string, ParsedChapter> = {};

export function useMarkdownChapter(chapterId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    // Check cache first
    if (parseCache[chapterId]) {
      return parseCache[chapterId];
    }

    // Get markdown content
    const markdown = markdownContentMap[chapterId];
    if (!markdown) {
      setError(`Chapter "${chapterId}" not found`);
      return null;
    }

    // Parse markdown
    const parsed = parseMarkdown(markdown);
    
    // Cache it
    parseCache[chapterId] = parsed;
    
    return parsed;
  }, [chapterId]);

  useEffect(() => {
    setIsLoading(false);
    if (!parsed) {
      setError(`Failed to load chapter "${chapterId}"`);
    } else {
      setError(null);
    }
  }, [chapterId, parsed]);

  return {
    content: parsed?.content || '',
    title: parsed?.title || '',
    summary: parsed?.summary || '',
    sections: parsed?.sections || [],
    isLoading,
    error,
  };
}





