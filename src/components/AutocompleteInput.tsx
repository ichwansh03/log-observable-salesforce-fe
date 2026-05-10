import React, { useState, useEffect, useRef } from 'react';
import './AutocompleteInput.css';

interface AutocompleteInputProps {
  items: { id: string; name: string; type?: string }[];
  placeholder: string;
  onSelect: (item: { id: string; name: string; type?: string } | null) => void;
  label: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ items, placeholder, onSelect, label }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; type?: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = items
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
    setSuggestions(filtered);
  }, [query, items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
    onSelect(null);
  };

  const handleSelect = (item: { id: string; name: string; type?: string }) => {
    setQuery(item.name);
    setShowSuggestions(false);
    onSelect(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="autocomplete-container" ref={containerRef}>
      <label className="autocomplete-label">{label}</label>
      <input
        type="text"
        className="autocomplete-input"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleSelect(item)}
            >
              <span className="suggestion-name">{item.name}</span>
              {item.type && <span className="suggestion-type">{item.type}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
