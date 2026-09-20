import { en, TranslationDictionary } from "./en";
import { hi } from "./hi";

export type Language = "en" | "hi";

export const translations: Record<Language, TranslationDictionary> = {
  en,
  hi,
};

export { en, hi };
export type { TranslationDictionary };
