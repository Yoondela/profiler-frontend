import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BriefcaseIcon from '@/assets/icons/other/briefcase.svg?react';
import { useServiceRequest } from '../contexts/ServiceRequestContext';

export default function ServiceField() {
  const { userService, setUserService } = useServiceRequest();

  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // debounce search
  useEffect(() => {
    if (!userService || userService.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/search/services`,
          {
            params: { q: userService },
          }
        );

        setSuggestions(res.data);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error('Service search error:', err);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [userService]);

  // click outside close
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

  // keyboard navigation
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
      handleSelect(selected.label);
    }

    if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleSelect = (label) => {
    setUserService(label);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="dropdown-container flex items-center gap-2">
        <BriefcaseIcon size={18} className="briefcase-icon" />

        <div>
          <input
            ref={inputRef}
            value={userService || ''}
            placeholder="Search service"
            onChange={(e) => setUserService(e.target.value)}
            onKeyDown={handleKeyDown}
            className="dropdown w-full"
            autoComplete="off"
          />
        </div>

        {userService && (
          <motion.button
            type="button"
            onClick={() => setUserService('')}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
            transition={{ duration: 0.2 }}
            className="clear-location"
          >
            <X size={18} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-0 w-full rounded-md border border-gray-200 bg-white shadow-md z-50"
          >
            {suggestions.map((item, index) => (
              <li
                key={item.refId}
                onMouseDown={() => handleSelect(item.label)}
                className={`cursor-pointer px-4 py-2 text-sm flex items-center gap-2 ${
                  index === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <BriefcaseIcon size={14} className="briefcase-icon pb-1" />

                {item.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
