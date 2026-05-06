"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSettingsStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(defaultValue);

  // Read from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors, keep default
    }
  }, [key]);

  // Persist to localStorage on change
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Ignore storage errors (quota, etc.)
        }
        return next;
      });
    },
    [key]
  );

  // Store initial default in ref to avoid useCallback invalidation from inline objects
  const defaultRef = useRef(defaultValue);

  // Reset to default and clear storage
  const reset = useCallback(() => {
    setState(defaultRef.current);
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }, [key]);

  return [state, setValue, reset];
}
