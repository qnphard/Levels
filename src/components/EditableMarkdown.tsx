import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import EditableText from './EditableText';
import TextEditModal from './TextEditModal';
import { useThemeColors, spacing, borderRadius } from '../theme/colors';
import { useContentEdit } from '../context/ContentEditContext';

interface EditableMarkdownProps {
  screen: string;
  section: string;
  originalContent: string;
  markdownStyles: any;
}

// Parse markdown into sections by headers (##)
function parseMarkdownSections(markdown: string): Array<{ title: string; content: string; id: string; fullMarkdown: string }> {
  const lines = markdown.split('\n');
  const sections: Array<{ title: string; content: string; id: string; fullMarkdown: string }> = [];
  let currentSection: { title: string; content: string[]; id: string } | null = null;
  let introLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for H2 header (##)
    if (line.trim().startsWith('## ')) {
      // Save previous section if exists
      if (currentSection) {
        const fullMarkdown = currentSection.content.join('\n');
        sections.push({
          title: currentSection.title,
          content: fullMarkdown.replace(/\*\*/g, '').replace(/\*/g, '').trim(), // Plain text version
          id: currentSection.id,
          fullMarkdown: `## ${currentSection.title}\n\n${fullMarkdown}`,
        });
      }
      
      // Start new section
      const title = line.replace(/^##+\s+/, '').trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      currentSection = {
        title,
        content: [],
        id,
      };
    } else if (line.trim().startsWith('# ')) {
      // H1 - skip, this is the main title
      continue;
    } else {
      // Add to current section or intro
      if (currentSection) {
        currentSection.content.push(line);
      } else {
        introLines.push(line);
      }
    }
  }
  
  // Add last section
  if (currentSection) {
    const fullMarkdown = currentSection.content.join('\n');
    sections.push({
      title: currentSection.title,
      content: fullMarkdown.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
      id: currentSection.id,
      fullMarkdown: `## ${currentSection.title}\n\n${fullMarkdown}`,
    });
  }
  
  // Add intro as first section if it exists
  if (introLines.length > 0) {
    const introText = introLines.join('\n').trim();
    if (introText) {
      sections.unshift({
        title: 'Introduction',
        content: introText.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
        id: 'introduction',
        fullMarkdown: introText,
      });
    }
  }
  
  return sections;
}

export default function EditableMarkdown({
  screen,
  section,
  originalContent,
  markdownStyles,
}: EditableMarkdownProps) {
  const theme = useThemeColors();
  const { editModeEnabled, getEditableContent, saveEdit } = useContentEdit();
  const [sections, setSections] = useState<Array<{ title: string; content: string; id: string; fullMarkdown: string }>>([]);
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Parse sections
  const parsedSections = useMemo(() => {
    return parseMarkdownSections(originalContent);
  }, [originalContent]);

  // Load edited content for each section
  useEffect(() => {
    setSections(parsedSections);
    
    const loadContents = async () => {
      const contents: Record<string, string> = {};
      for (const sec of parsedSections) {
        const edited = await getEditableContent(screen, section, `section-${sec.id}-content`, sec.content);
        contents[sec.id] = edited;
      }
      setSectionContents(contents);
    };
    
    loadContents();
  }, [parsedSections, screen, section, getEditableContent]);

  const handleEdit = (secId: string) => {
    setEditingSection(secId);
    setShowEditModal(true);
  };

  const handleSave = async (newContent: string) => {
    if (editingSection) {
      await saveEdit(screen, section, `section-${editingSection}-content`, newContent);
      setSectionContents(prev => ({
        ...prev,
        [editingSection]: newContent,
      }));
      setShowEditModal(false);
      setEditingSection(null);
    }
  };

  const styles = StyleSheet.create({
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      marginBottom: spacing.md,
    },
    markdownWrapper: {
      marginTop: spacing.sm,
      position: 'relative',
    },
    editButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.primary,
      borderRadius: borderRadius.full,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      borderWidth: 2,
      borderColor: theme.white,
      ...(theme.mode === 'dark' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.8,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 8,
      }),
      ...(theme.mode === 'light' && {
        shadowColor: theme.primary,
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 6,
      }),
    },
  });

  const currentSection = editingSection ? sections.find(s => s.id === editingSection) : null;

  return (
    <View>
      {/* Render each section */}
      {sections.map((sec) => {
        const displayContent = sectionContents[sec.id] || sec.content;
        // Don't include title in markdown since we render it separately
        const markdownContent = displayContent;
        
        return (
          <View key={sec.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <EditableText
                screen={screen}
                section={section}
                id={`section-${sec.id}-title`}
                originalContent={sec.title}
                textStyle={markdownStyles.heading2}
                type="title"
              />
            </View>
            <View style={styles.markdownWrapper}>
              {editModeEnabled && (
                <Pressable
                  style={styles.editButton}
                  onPress={() => handleEdit(sec.id)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="create-outline" size={18} color={theme.white} />
                </Pressable>
              )}
              {/* Render formatted markdown (content only, title rendered separately) */}
              <Markdown style={markdownStyles}>{markdownContent}</Markdown>
            </View>
          </View>
        );
      })}
      
      {/* Edit Modal */}
      {currentSection && (
        <TextEditModal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingSection(null);
          }}
          screen={screen}
          section={section}
          id={`section-${currentSection.id}-content`}
          originalContent={currentSection.content}
          editedContent={sectionContents[currentSection.id]}
          isOriginal={true}
          onSave={handleSave}
        />
      )}
    </View>
  );
}

