import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * useState, but mirrored to localStorage.
 * - Reads localStorage once on mount (lazy initializer).
 * - Writes to localStorage whenever the value or key changes.
 */
export function useLocalStorageState<T>(
  initialState: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(function () {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null
        ? (JSON.parse(storedValue) as T)
        : initialState;
    } catch {
      // Corrupt/invalid JSON in storage → fall back safely
      return initialState;
    }
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
