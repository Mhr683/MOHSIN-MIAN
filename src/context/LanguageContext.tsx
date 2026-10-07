import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AppLanguage = 'en' | 'ur' | 'roman-urdu';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (_key: string, defaultText?: string) => defaultText || '',
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('ym_language') as AppLanguage) || 'en';
  });

  const handleSetLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
    localStorage.setItem('ym_language', lang);
  };

  const toggleLanguage = () => {
    handleSetLanguage(language === 'en' ? 'ur' : 'en');
  };

  const t = (_key: string, defaultText?: string) => defaultText || _key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
