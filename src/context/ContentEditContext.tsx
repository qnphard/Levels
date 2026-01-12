import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ContentSectionType = 'paragraph' | 'quote' | 'mantra' | 'title' | 'description' | 'subtitle';

export interface ContentSection {
  id: string;
  type: ContentSectionType;
  content: string;
  order: number;
  isOriginal: boolean;
}

export interface CardData {
  id: string;
  type: 'library' | 'level';
  title: string;
  description: string;
  order: number;
  isOriginal: boolean;
  // For library cards
  icon?: string;
  navigationTarget?: string;
  // For level cards
  level?: number;
  antithesis?: string;
  color?: string;
  gradient?: readonly [string, string];
  gradientDark?: readonly [string, string];
  glowDark?: string;
}

interface ContentEditContextType {
  editModeEnabled: boolean;
  toggleEditMode: () => Promise<void>;
  getEditableContent: (screen: string, section: string, id: string, originalContent: string) => Promise<string>;
  getContentStructure: (screen: string, section: string) => Promise<ContentSection[] | null>;
  saveEdit: (screen: string, section: string, id: string, content: string) => Promise<void>;
  saveStructure: (screen: string, section: string, structure: ContentSection[]) => Promise<void>;
  addSection: (screen: string, section: string, newSection: ContentSection, position?: 'before' | 'after' | 'end', targetId?: string) => Promise<void>;
  deleteSection: (screen: string, section: string, id: string) => Promise<void>;
  reorderSection: (screen: string, section: string, id: string, direction: 'up' | 'down') => Promise<void>;
  resetEdit: (screen: string, section: string, id: string) => Promise<void>;
  resetStructure: (screen: string, section: string) => Promise<void>;
  // Card management
  getCards: (screen: string, section: string) => Promise<CardData[] | null>;
  saveCards: (screen: string, section: string, cards: CardData[]) => Promise<void>;
  addCard: (screen: string, section: string, newCard: CardData, position?: 'before' | 'after' | 'end', targetId?: string) => Promise<void>;
  deleteCard: (screen: string, section: string, id: string) => Promise<void>;
  reorderCard: (screen: string, section: string, id: string, direction: 'up' | 'down') => Promise<void>;
}

const ContentEditContext = createContext<ContentEditContextType | undefined>(undefined);

const STORAGE_PREFIX_EDIT = '@content_edit:';
const STORAGE_PREFIX_STRUCTURE = '@content_structure:';
const STORAGE_PREFIX_CARDS = '@content_cards:';
const STORAGE_KEY_EDIT_MODE = '@content_edit_mode_enabled';

export const ContentEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editModeEnabled, setEditModeEnabled] = useState<boolean>(false);

  // Load edit mode preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_EDIT_MODE);
        if (stored !== null) {
          setEditModeEnabled(stored === 'true');
        }
      } catch (error) {
        console.error('Failed to load edit mode preference:', error);
      }
    })();
  }, []);

  const toggleEditMode = useCallback(async () => {
    const newValue = !editModeEnabled;
    setEditModeEnabled(newValue);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_EDIT_MODE, String(newValue));
    } catch (error) {
      console.error('Failed to save edit mode preference:', error);
    }
  }, [editModeEnabled]);

  const getStorageKey = (prefix: string, screen: string, section: string, id?: string): string => {
    if (id) {
      return `${prefix}${screen}:${section}:${id}`;
    }
    return `${prefix}${screen}:${section}`;
  };

  const getEditableContent = useCallback(async (
    screen: string,
    section: string,
    id: string,
    originalContent: string
  ): Promise<string> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_EDIT, screen, section, id);
      const edited = await AsyncStorage.getItem(key);
      return edited || originalContent;
    } catch (error) {
      console.error('Failed to get editable content:', error);
      return originalContent;
    }
  }, []);

  const getContentStructure = useCallback(async (
    screen: string,
    section: string
  ): Promise<ContentSection[] | null> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_STRUCTURE, screen, section);
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Failed to get content structure:', error);
      return null;
    }
  }, []);

  const saveEdit = useCallback(async (
    screen: string,
    section: string,
    id: string,
    content: string
  ): Promise<void> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_EDIT, screen, section, id);
      await AsyncStorage.setItem(key, content);
    } catch (error) {
      console.error('Failed to save edit:', error);
    }
  }, []);

  const saveStructure = useCallback(async (
    screen: string,
    section: string,
    structure: ContentSection[]
  ): Promise<void> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_STRUCTURE, screen, section);
      await AsyncStorage.setItem(key, JSON.stringify(structure));
    } catch (error) {
      console.error('Failed to save structure:', error);
    }
  }, []);

  const addSection = useCallback(async (
    screen: string,
    section: string,
    newSection: ContentSection,
    position: 'before' | 'after' | 'end' = 'end',
    targetId?: string
  ): Promise<void> => {
    try {
      const currentStructure = await getContentStructure(screen, section);
      let updatedStructure: ContentSection[];

      if (!currentStructure) {
        // Initialize with just the new section
        updatedStructure = [newSection];
      } else {
        updatedStructure = [...currentStructure];

        if (position === 'end') {
          // Add at the end
          const maxOrder = Math.max(...updatedStructure.map(s => s.order), -1);
          newSection.order = maxOrder + 1;
          updatedStructure.push(newSection);
        } else if (targetId) {
          // Find target index
          const targetIndex = updatedStructure.findIndex(s => s.id === targetId);
          if (targetIndex !== -1) {
            if (position === 'before') {
              // Insert before target
              newSection.order = updatedStructure[targetIndex].order;
              // Increment order of target and all following items
              updatedStructure.forEach(s => {
                if (s.order >= updatedStructure[targetIndex].order) {
                  s.order += 1;
                }
              });
              updatedStructure.splice(targetIndex, 0, newSection);
            } else if (position === 'after') {
              // Insert after target
              newSection.order = updatedStructure[targetIndex].order + 1;
              // Increment order of all following items
              updatedStructure.forEach(s => {
                if (s.order > updatedStructure[targetIndex].order) {
                  s.order += 1;
                }
              });
              updatedStructure.splice(targetIndex + 1, 0, newSection);
            }
          } else {
            // Target not found, add at end
            const maxOrder = Math.max(...updatedStructure.map(s => s.order), -1);
            newSection.order = maxOrder + 1;
            updatedStructure.push(newSection);
          }
        } else {
          // No target, add at end
          const maxOrder = Math.max(...updatedStructure.map(s => s.order), -1);
          newSection.order = maxOrder + 1;
          updatedStructure.push(newSection);
        }
      }

      // Sort by order
      updatedStructure.sort((a, b) => a.order - b.order);

      await saveStructure(screen, section, updatedStructure);
    } catch (error) {
      console.error('Failed to add section:', error);
    }
  }, [getContentStructure, saveStructure]);

  const deleteSection = useCallback(async (
    screen: string,
    section: string,
    id: string
  ): Promise<void> => {
    try {
      const currentStructure = await getContentStructure(screen, section);
      if (!currentStructure) return;

      const updatedStructure = currentStructure.filter(s => s.id !== id);
      
      // Also remove any edits for this section
      const editKey = getStorageKey(STORAGE_PREFIX_EDIT, screen, section, id);
      await AsyncStorage.removeItem(editKey);

      await saveStructure(screen, section, updatedStructure);
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  }, [getContentStructure, saveStructure]);

  const reorderSection = useCallback(async (
    screen: string,
    section: string,
    id: string,
    direction: 'up' | 'down'
  ): Promise<void> => {
    try {
      const currentStructure = await getContentStructure(screen, section);
      if (!currentStructure) return;

      const updatedStructure = [...currentStructure];
      const index = updatedStructure.findIndex(s => s.id === id);
      if (index === -1) return;

      if (direction === 'up' && index > 0) {
        // Swap with previous
        const temp = updatedStructure[index].order;
        updatedStructure[index].order = updatedStructure[index - 1].order;
        updatedStructure[index - 1].order = temp;
      } else if (direction === 'down' && index < updatedStructure.length - 1) {
        // Swap with next
        const temp = updatedStructure[index].order;
        updatedStructure[index].order = updatedStructure[index + 1].order;
        updatedStructure[index + 1].order = temp;
      } else {
        return; // Can't move further
      }

      // Sort by order
      updatedStructure.sort((a, b) => a.order - b.order);

      await saveStructure(screen, section, updatedStructure);
    } catch (error) {
      console.error('Failed to reorder section:', error);
    }
  }, [getContentStructure, saveStructure]);

  const resetEdit = useCallback(async (
    screen: string,
    section: string,
    id: string
  ): Promise<void> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_EDIT, screen, section, id);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to reset edit:', error);
    }
  }, []);

  const resetStructure = useCallback(async (
    screen: string,
    section: string
  ): Promise<void> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_STRUCTURE, screen, section);
      await AsyncStorage.removeItem(key);
      
      // Also remove all edits for this section
      const allKeys = await AsyncStorage.getAllKeys();
      const editKeys = allKeys.filter(k => 
        k.startsWith(getStorageKey(STORAGE_PREFIX_EDIT, screen, section))
      );
      await AsyncStorage.multiRemove(editKeys);
    } catch (error) {
      console.error('Failed to reset structure:', error);
    }
  }, []);

  // Card management functions
  const getCards = useCallback(async (
    screen: string,
    section: string
  ): Promise<CardData[] | null> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_CARDS, screen, section);
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Failed to get cards:', error);
      return null;
    }
  }, []);

  const saveCards = useCallback(async (
    screen: string,
    section: string,
    cards: CardData[]
  ): Promise<void> => {
    try {
      const key = getStorageKey(STORAGE_PREFIX_CARDS, screen, section);
      await AsyncStorage.setItem(key, JSON.stringify(cards));
    } catch (error) {
      console.error('Failed to save cards:', error);
    }
  }, []);

  const addCard = useCallback(async (
    screen: string,
    section: string,
    newCard: CardData,
    position: 'before' | 'after' | 'end' = 'end',
    targetId?: string
  ): Promise<void> => {
    try {
      const currentCards = await getCards(screen, section);
      let updatedCards: CardData[];

      if (!currentCards) {
        updatedCards = [newCard];
      } else {
        updatedCards = [...currentCards];

        if (position === 'end') {
          const maxOrder = Math.max(...updatedCards.map(c => c.order), -1);
          newCard.order = maxOrder + 1;
          updatedCards.push(newCard);
        } else if (targetId) {
          const targetIndex = updatedCards.findIndex(c => c.id === targetId);
          if (targetIndex !== -1) {
            if (position === 'before') {
              newCard.order = updatedCards[targetIndex].order;
              updatedCards.forEach(c => {
                if (c.order >= updatedCards[targetIndex].order) {
                  c.order += 1;
                }
              });
              updatedCards.splice(targetIndex, 0, newCard);
            } else if (position === 'after') {
              newCard.order = updatedCards[targetIndex].order + 1;
              updatedCards.forEach(c => {
                if (c.order > updatedCards[targetIndex].order) {
                  c.order += 1;
                }
              });
              updatedCards.splice(targetIndex + 1, 0, newCard);
            }
          } else {
            const maxOrder = Math.max(...updatedCards.map(c => c.order), -1);
            newCard.order = maxOrder + 1;
            updatedCards.push(newCard);
          }
        } else {
          const maxOrder = Math.max(...updatedCards.map(c => c.order), -1);
          newCard.order = maxOrder + 1;
          updatedCards.push(newCard);
        }
      }

      updatedCards.sort((a, b) => a.order - b.order);
      await saveCards(screen, section, updatedCards);
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  }, [getCards, saveCards]);

  const deleteCard = useCallback(async (
    screen: string,
    section: string,
    id: string
  ): Promise<void> => {
    try {
      const currentCards = await getCards(screen, section);
      if (!currentCards) return;

      const updatedCards = currentCards.filter(c => c.id !== id);
      await saveCards(screen, section, updatedCards);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  }, [getCards, saveCards]);

  const reorderCard = useCallback(async (
    screen: string,
    section: string,
    id: string,
    direction: 'up' | 'down'
  ): Promise<void> => {
    try {
      const currentCards = await getCards(screen, section);
      if (!currentCards) return;

      const updatedCards = [...currentCards];
      const index = updatedCards.findIndex(c => c.id === id);
      if (index === -1) return;

      if (direction === 'up' && index > 0) {
        const temp = updatedCards[index].order;
        updatedCards[index].order = updatedCards[index - 1].order;
        updatedCards[index - 1].order = temp;
      } else if (direction === 'down' && index < updatedCards.length - 1) {
        const temp = updatedCards[index].order;
        updatedCards[index].order = updatedCards[index + 1].order;
        updatedCards[index + 1].order = temp;
      } else {
        return;
      }

      updatedCards.sort((a, b) => a.order - b.order);
      await saveCards(screen, section, updatedCards);
    } catch (error) {
      console.error('Failed to reorder card:', error);
    }
  }, [getCards, saveCards]);

  return (
    <ContentEditContext.Provider
      value={{
        editModeEnabled,
        toggleEditMode,
        getEditableContent,
        getContentStructure,
        saveEdit,
        saveStructure,
        addSection,
        deleteSection,
        reorderSection,
        resetEdit,
        resetStructure,
        getCards,
        saveCards,
        addCard,
        deleteCard,
        reorderCard,
      }}
    >
      {children}
    </ContentEditContext.Provider>
  );
};

export const useContentEdit = () => {
  const context = useContext(ContentEditContext);
  if (!context) {
    throw new Error('useContentEdit must be used within ContentEditProvider');
  }
  return context;
};

