import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useSearchContext } from './context/context';
import IntroSearchResults from './IntroSearchResults';

export default function SearchProvider() {
  const { searchfield, setSearchfield } = useSearchContext();

  // Local UI helpers
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Search submit handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchfield.trim()) return;
    // Lifted state goes to parent or triggers API call
    console.log('Searching for:', searchfield);
  };

  return (
    <div className="search-wrapper">
      <div className="search-container pt-7">
        <h2 className="title">Find Your Service</h2>
        <p className="paragraph">Search by user, provider, or service.</p>

        <form onSubmit={handleSearch}>
          <div className="search-input-container relative">
            <Search width="20" height="20" className="search-icon" />

            <div className="local-search w-full">
              <input
                type="text"
                placeholder="Search"
                className="search-input pr-8"
                value={searchfield}
                onChange={(e) => setSearchfield(e.target.value)}
                ref={inputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchfield('');
                }}
              />
            </div>

            {/* Clear Button (X) */}
            <AnimatePresence>
              {searchfield && (
                <motion.button
                  type="button"
                  onClick={() => setSearchfield('')}
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

          <div className="search-btn mt-3">
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
      <IntroSearchResults />
    </div>
  );
}
