import { useState, useEffect } from 'react';

const STORAGE_KEY = 'recent_searches';
const MAX_ITEMS = 10;

export function useRecentSearches() {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  const addSearch = (term) => {
    if (!term || typeof term !== 'string') return;
    const trimmed = term.trim();
    if (!trimmed) return;

    setSearches(prev => {
      const filtered = prev.filter(item => item !== trimmed);
      const newSearches = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const removeSearch = (term, e) => {
    if (e) e.stopPropagation();
    setSearches(prev => {
      const newSearches = prev.filter(item => item !== term);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const clearSearches = () => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { searches, addSearch, removeSearch, clearSearches };
}
