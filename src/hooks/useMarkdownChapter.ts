import { useState, useEffect, useMemo } from 'react';
import { markdownContentMap } from '../assets/feelings/markdownContent';
import { articleContentMap } from '../assets/articles/articleContent';

export interface ParsedSection {
  id: string; // anchor-friendly ID
  title: string; // section title
  level: number; // 2 for H2, 3 for H3
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
  let foundTitle = false;
  let foundSummary = false;

  // Extract title (first H1)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      title = line.replace(/^#\s+/, '').trim();
      foundTitle = true;
      continue;
    }

    // Extract summary (first paragraph after title, before first H2)
    if (foundTitle && !foundSummary && line && !line.startsWith('#')) {
      // Skip markdown formatting but keep text
      const cleanLine = line
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/^>\s+/, '') // Remove blockquote marker
        .replace(/---/g, '') // Remove horizontal rules
        .trim();

      if (cleanLine && cleanLine.length > 20) {
        // Take first substantial paragraph as summary
        summary = cleanLine.substring(0, 200); // Limit summary length
        if (summary.length < cleanLine.length) {
          summary += '...';
        }
        foundSummary = true;
      }
    }

    // Extract sections (H2 and H3)
    if (line.startsWith('## ')) {
      const sectionTitle = line.replace(/^##+\s+/, '').trim();
      const id = sectionTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      sections.push({
        id,
        title: sectionTitle,
        level: line.startsWith('###') ? 3 : 2,
      });
    } else if (line.startsWith('### ')) {
      const sectionTitle = line.replace(/^###+\s+/, '').trim();
      const id = sectionTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      sections.push({
        id,
        title: sectionTitle,
        level: 3,
      });
    }
  }

  // Fallback summary if not found
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
    const markdown = markdownContentMap[chapterId] || articleContentMap[chapterId];
    if (!markdown) {
      setError(`Content "${chapterId}" not found`);
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





