import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  onClick,
  className = '',
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${
        hoverable ? 'hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 font-semibold">
          {title}
        </div>
      )}
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};
