/**
 * ИСПОЛЬЗУЕТСЯ В:
 * 
 * UserSearch.tsx:
 *   import { Input } from '../minimal_test/ui/Input';
 *   
 *   // Поиск пользователей с debounce 300ms
 *   <Input 
 *     type="search"
 *     value={query}
 *     onChange={setQuery}
 *     placeholder="Поиск пользователей..."
 *   />
 */

import React from 'react';

interface InputProps {
  type?: 'text' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
