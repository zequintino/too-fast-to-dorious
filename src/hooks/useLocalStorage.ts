import { useState, useEffect, useRef } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const firstRender = useRef(true);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage on first render
  useEffect(() => {
    if (firstRender.current) {
      const item = localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
      firstRender.current = false;
    }
  }, [key]);

  // Update localStorage when state changes
  useEffect(() => {
    if (!firstRender.current) {
      localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
