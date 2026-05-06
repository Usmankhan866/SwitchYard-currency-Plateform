"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Locale } from "./config";
import { defaultLocale, LOCALE_STORAGE_KEY } from "./config";

import en from "./messages/en.json";
import de from "./messages/de.json";
import fr from "./messages/fr.json";

type Messages = typeof en;
type NestedKeyOf<T, P extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], P extends "" ? K : `${P}.${K}`>
        : P extends ""
          ? K
          : `${P}.${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<Messages>;

const messagesMap: Record<Locale, Messages> = { en, de, fr };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return defaultLocale;
    return (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale) || defaultLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => getNestedValue(messagesMap[locale] as unknown as Record<string, unknown>, key),
    [locale]
  );

  return (
    <LocaleContext value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

export function useTranslations() {
  const { t } = useLocale();
  return t;
}
