import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

interface Translations {
  [key: string]: string | string[];
}

interface LanguageContextType {
  language: string;
  translations: Translations;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const loadTranslations = async (lang: string): Promise<Translations> => {
  try {
    switch (lang) {
      case "nl":
        return (await import("../translation/bg.json")).default;
      case "en":
      default:
        return (await import("../translation/en.json")).default;
    }
  } catch (error) {
    console.error("Failed to load translation file:", error);
    return {};
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>("en");
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const storedLang = localStorage.getItem("app-language") || "en";
    setLanguage(storedLang);
    loadTranslations(storedLang).then(setTranslations);
  }, []);

  const changeLanguage = useCallback((lang: string) => {
    localStorage.setItem("app-language", lang);
    setLanguage(lang);
    toast.success(`Language successfully changed to ${lang.toUpperCase()}`);
    loadTranslations(lang).then(setTranslations);
  }, []);

  return (
    <LanguageContext.Provider
      value={{ language, translations, changeLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const getTranslation = (
  key: string,
  translations: Translations
): string => {
  const translation = translations[key];
  if (Array.isArray(translation)) {
    return translation.join(", ");
  }
  return translation ?? key;
};
