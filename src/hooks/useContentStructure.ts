import { useState, useEffect, useCallback } from 'react';
import { useContentEdit, ContentSection } from '../context/ContentEditContext';

export function useContentStructure(screen: string, section: string) {
  const { getContentStructure, saveStructure } = useContentEdit();
  const [structure, setStructure] = useState<ContentSection[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStructure = useCallback(async () => {
    setIsLoading(true);
    try {
      const stored = await getContentStructure(screen, section);
      setStructure(stored);
    } catch (error) {
      console.error('Failed to load content structure:', error);
      setStructure(null);
    } finally {
      setIsLoading(false);
    }
  }, [screen, section, getContentStructure]);

  useEffect(() => {
    loadStructure();
  }, [loadStructure]);

  const refreshStructure = useCallback(() => {
    loadStructure();
  }, [loadStructure]);

  return {
    structure,
    isLoading,
    refreshStructure,
  };
}



