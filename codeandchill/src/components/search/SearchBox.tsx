import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchResults } from './SearchResults';
import { useSearch } from '@/hooks/useSearch';

export const SearchBox: React.FC = () => {
  const {
    query,
    results,
    isLoading,
    isOpen,
    handleQueryChange,
    clearSearch,
    closeSearch,
    setIsOpen
  } = useSearch();

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      
      // Escape to close search
      if (event.key === 'Escape') {
        closeSearch();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch, setIsOpen]);

  const handleInputFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  const handleResultClick = () => {
    closeSearch();
    inputRef.current?.blur();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-sm">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            className="w-full rounded-xl bg-gray-800 pl-12 pr-10 h-10 text-gray-100 placeholder:text-gray-500 border border-gray-700 focus-visible:ring-2 focus-visible:ring-purple-500"
            placeholder="Search courses, problems, quizzes... (Ctrl+K)"
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={handleInputFocus}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-200"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      
      {isOpen && (
        <SearchResults
          results={results}
          isLoading={isLoading}
          query={query}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  );
};