import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Briefcase,
  User,
  Layers,
  MapPin,
  Building2,
} from 'lucide-react';
import { useSearchContext } from './context/context';
import axios from 'axios';

const typeIconMap = {
  service: Briefcase,
  provider: Building2,
  user: User,
  category: Layers,
  location: MapPin,
};

export default function SearchProvider() {
  const { searchField, setSearchField } = useSearchContext();

  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Autofocus input
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Backend autocomplete (debounced)
  useEffect(() => {
    if (!searchField || searchField.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/search/autocomplete`,
          {
            params: { q: searchField },
          }
        );

        setSuggestions(res.data);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error('Autocomplete error:', err.response?.data || err.message);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchField]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Submit search (unchanged behavior)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchField.trim()) return;
    console.log('Searching for:', searchField);
    setOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    }

    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[activeIndex];
      setSearchField(selected.label);
      setOpen(false);
    }

    if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleSelect = (label) => {
    setSearchField(label);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="search-app-wrapper border-b border-gray-200"
    >
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-input-container relative">
            <Search width="20" height="20" className="search-icon" />

            <div className="local-search w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                className="search-input pr-8"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            </div>

            {/* Clear Button */}
            <AnimatePresence>
              {searchField && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setSearchField('');
                    setSuggestions([]);
                    setOpen(false);
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X size={18} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {open && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[2rem] left-[1rem] mt-2 w-[440px] rounded-md border bg-white shadow-md"
                >
                  {suggestions.map((item, index) => (
                    <li
                      key={`${item.type}-${item.label}`}
                      onMouseDown={() => handleSelect(item.label)}
                      className={`cursor-pointer px-4 py-2 text-sm flex items-center gap-3 rounded-md
                        ${
                          index === activeIndex
                            ? 'bg-gray-100'
                            : 'hover:bg-gray-50'
                        }`}
                    >
                      {(() => {
                        const Icon = typeIconMap[item.type];
                        return Icon ? (
                          <Icon size={16} className="text-gray-500 shrink-0" />
                        ) : null;
                      })()}

                      <div className="flex flex-col">
                        <span className="text-sm">{item.label}</span>
                        <span className="text-xs text-gray-400 capitalize">
                          {item.type}
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      {/* Existing quick keys (unchanged) */}
      <div className="search-keys">
        <div className="key">Current location</div>
        <div className="key">3 or more stars</div>
        <div className="key">Cleaners</div>
      </div>
    </div>
  );
}
