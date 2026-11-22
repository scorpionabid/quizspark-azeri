import React, { createContext, useContext, useEffect, useState } from 'react';
import { AVAILABLE_FONTS, DEFAULT_FONT_ID, FontConfig } from '@/lib/constants/fonts';

interface FontContextType {
  currentFont: FontConfig;
  setFont: (fontId: string) => void;
  availableFonts: FontConfig[];
  resetFont: () => void;
}

const STORAGE_KEY = 'app_font_family';

const FontContext = createContext<FontContextType | undefined>(undefined);

function applyFontToDOM(font: FontConfig) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--font-sans', font.fontFamily);
  if (font.displayFontFamily) {
    root.style.setProperty('--font-display', font.displayFontFamily);
  }
  document.body.style.fontFamily = font.fontFamily;
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [currentFontId, setCurrentFontId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && AVAILABLE_FONTS.some((f) => f.id === saved)) {
        return saved;
      }
    }
    return DEFAULT_FONT_ID;
  });

  const currentFont = AVAILABLE_FONTS.find((f) => f.id === currentFontId) || AVAILABLE_FONTS[0];

  useEffect(() => {
    applyFontToDOM(currentFont);
  }, [currentFont]);

  const setFont = (fontId: string) => {
    const found = AVAILABLE_FONTS.find((f) => f.id === fontId);
    if (found) {
      setCurrentFontId(fontId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, fontId);
      }
      applyFontToDOM(found);
    }
  };

  const resetFont = () => {
    setFont(DEFAULT_FONT_ID);
  };

  return (
    <FontContext.Provider
      value={{
        currentFont,
        setFont,
        availableFonts: AVAILABLE_FONTS,
        resetFont,
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}
