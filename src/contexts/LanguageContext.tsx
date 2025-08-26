// src/contexts/LanguageContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

   useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
    document.documentElement.lang = selectedLanguage;
  }, [selectedLanguage]);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
