import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  displayKey = "name" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option[displayKey] === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`mt-1 relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption[displayKey] : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-t-md border-0 pl-10 py-2 text-gray-900 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="max-h-60 overflow-auto rounded-b-md py-1 text-base focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 ? (
              <li className="text-gray-500 px-3 py-2 text-center">No results found</li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.isoCode || option[displayKey]}
                  className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                  onClick={() => {
                    onChange(option[displayKey]);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className={`block truncate ${value === option[displayKey] ? 'font-semibold' : 'font-normal'}`}>
                    {option[displayKey]}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect; 