/**
 * ИСПОЛЬЗУЕТСЯ В:
 * 
 * UserSearch.tsx:
 *   import { Button } from '../minimal_test/ui/Button';
 *   <Button onClick={() => onSelect(user)}>Выбрать</Button>
 * 
 * TaskDetailModal.tsx:
 *   import { Button } from '../minimal_test/ui/Button';
 *   <Button variant="danger" onClick={onDelete}>Удалить</Button>
 *   <Button variant="secondary" onClick={onClose}>Закрыть</Button>
 */

import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  type = 'button',
  disabled = false,
}) => {
  const styles: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-medium transition-colors ${styles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};
