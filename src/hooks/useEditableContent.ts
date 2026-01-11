import { useState, useEffect } from 'react';
import { useContentEdit } from '../context/ContentEditContext';

export function useEditableContent(
  screen: string,
  section: string,
  id: string,
  originalContent: string
) {
  const { getEditableContent } = useContentEdit();
  const [content, setContent] = useState(originalContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const editedContent = await getEditableContent(screen, section, id, originalContent);
        setContent(editedContent);
      } catch (error) {
        console.error('Failed to load editable content:', error);
        setContent(originalContent);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [screen, section, id, originalContent, getEditableContent]);

  return { content, isLoading, isEdited: content !== originalContent };
}



