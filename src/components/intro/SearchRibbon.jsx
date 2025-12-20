import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useSearchContext } from './context/context';

export default function SearchProvider() {
  const { searchField, setSearchField } = useSearchContext();

  console.log('Search field value:', searchField);
  // Local UI helpers
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Search submit handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchField.trim()) return;
    // Lifted state goes to parent or triggers API call
    console.log('Searching for:', searchField);
  };

  return (
    <div className="search-app-wrapper">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-input-container relative">
            <Search width="20" height="20" className="search-icon" />

            <div className="local-search w-full">
              <input
                type="text"
                placeholder="Search"
                className="search-input pr-8"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                ref={inputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchField('');
                }}
              />
            </div>

            {/* Clear Button (X) */}
            <AnimatePresence>
              {searchField && (
                <motion.button
                  type="button"
                  onClick={() => setSearchField('')}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}
