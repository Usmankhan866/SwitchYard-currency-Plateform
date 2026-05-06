export type Locale = "en" | "de" | "fr";

export interface LocaleOption {
  code: Locale;
  label: string;
  flag: string;
}

export const locales: LocaleOption[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export const defaultLocale: Locale = "en";

export const LOCALE_STORAGE_KEY = "apex-locale";
