import { createContext } from "react";
import { useTranslation } from "react-i18next";
export const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  document.dir = i18n.resolvedLanguage == "en" ? 'ltr' : 'rtl'

  const toggleLanguage = () => {
    i18n.resolvedLanguage == "en"
    ? i18n.changeLanguage("ar")
    : i18n.changeLanguage("en");
    document.dir = i18n.resolvedLanguage == "en" ? 'ltr' : 'rtl'
  };
  
  return (
    <LanguageContext.Provider value={{t, toggleLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
