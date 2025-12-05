/**
 * ИСПОЛЬЗУЕТСЯ В:
 * 
 * UserSearch.tsx:
 *   import { Card } from '../minimal_test/ui/Card';
 *   
 *   // Карточка для каждого пользователя в результатах
 *   <Card hoverable onClick={() => onSelect(user)}>
 *     <div>{user.fullname}</div>
 *     <div className="">{user.email}</div>
 *   </Card>
 * 
 * TaskDetailModal.tsx:
 *   import { Card } from '../minimal_test/ui/Card';
 *   
 *   // Обертка для контента деталей задачи
 *   <Card title="Детали задачи">
 *     <div>Описание: {task.description}</div>
 *     <div>Статус: {task.status}</div>
 *   </Card>
 */

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${
        hoverable ? 'hover:shadow-md cursor-pointer transition-shadow' : ''
      }`}
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
