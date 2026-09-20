"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { translations, Language, TranslationDictionary } from "./translations";

const STORAGE_KEY = "jharsetu-language";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, fallbackOrParams?: Record<string, string | number> | string) => string;
  translations: TranslationDictionary;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

/**
 * Helper to safely resolve dot-notated keys from an object
 * e.g. resolveKey(en, "nav.reportProblem") => "Report a Problem"
 */
function resolveKey(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== "object") {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  // SSR-Safe hydration from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
      }
    } catch {
      // localStorage may be unavailable in private browsing / restricted contexts
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync document lang attribute
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore write errors
    }
  }, []);

  const currentDict = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  const t = useCallback(
    (
      keyPath: string,
      fallbackOrParams?: Record<string, string | number> | string
    ): string => {
      let value = resolveKey(currentDict, keyPath);

      // Fallback to English dictionary if key is missing in Hindi
      if (value === undefined && language !== "en") {
        value = resolveKey(translations.en, keyPath);
      }

      // If still not found and a custom string fallback was provided
      if (value === undefined) {
        if (typeof fallbackOrParams === "string") {
          return fallbackOrParams;
        }
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] Missing translation key: "${keyPath}" for language: "${language}"`);
        }
        return keyPath;
      }

      if (typeof value !== "string") {
        return String(value);
      }

      // Interpolate parameters if an object was passed (e.g. { name: "User" })
      if (typeof fallbackOrParams === "object" && fallbackOrParams !== null) {
        let text = value;
        for (const [k, v] of Object.entries(fallbackOrParams)) {
          text = text.replace(new RegExp(`{{${k}}}`, "g"), String(v));
        }
        return text;
      }

      return value;
    },
    [currentDict, language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      translations: currentDict,
      isHydrated,
    }),
    [language, setLanguage, t, currentDict, isHydrated]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to consume current language context and translation helper
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for non-provider contexts (e.g. isolated unit tests)
    return {
      language: "en",
      setLanguage: () => {},
      t: (keyPath: string, fallback?: any) =>
        typeof fallback === "string" ? fallback : keyPath,
      translations: translations.en,
      isHydrated: true,
    };
  }
  return context;
}

export default LanguageProvider;
