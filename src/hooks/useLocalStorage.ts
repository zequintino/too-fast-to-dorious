import { useState, useEffect, useRef } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const isInitialMount = useRef(true);
  const [storedVal, setStoredVal] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(storedVal));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedVal]);

  return [storedVal, setStoredVal] as const;
}

export default useLocalStorage;
