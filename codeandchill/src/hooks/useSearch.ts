import { useState, useEffect, useCallback } from 'react';
import { SearchService, SearchResult } from '@/services/searchService';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced search function
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await SearchService.globalSearch(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounce search queries
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Handle query change
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setIsOpen(newQuery.trim().length > 0);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setIsLoading(false);
  };

  // Close search results
  const closeSearch = () => {
    setIsOpen(false);
  };

  return {
    query,
    results,
    isLoading,
    isOpen,
    handleQueryChange,
    clearSearch,
    closeSearch,
    setIsOpen
  };
};