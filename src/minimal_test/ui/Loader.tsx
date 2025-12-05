/**
 * ИНДИКАТОР ЗАГРУЗКИ
 * 
 * ИСПОЛЬЗУЕТСЯ В:
 * 
 * UserSearch.tsx:
 *   import { Loader } from '../minimal_test/ui/Loader';
 *   
 *   // Показывать во время поиска
 *   {loading && <Loader text="Поиск пользователей..." />}
 * 
 * TaskDetailModal.tsx:
 *   import { Loader } from '../minimal_test/ui/Loader';
 *   
 *   // Если данные задачи загружаются
 *   {loading ? <Loader /> : <TaskDetails />}
 * 
 * Использовать Loader когда loading === true
 */

import React from 'react';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};
