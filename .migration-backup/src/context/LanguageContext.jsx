// ============================================================
// PureLife — LanguageContext
// src/context/LanguageContext.jsx
// Context global de idioma — accesible desde cualquier componente
// sin prop drilling. Un cambio de idioma actualiza TODA la app.
// ============================================================
import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadLang, saveLang } from '../i18n';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => loadLang());

  const setLang = useCallback((code) => {
    saveLang(code);
    setLangState(code);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
