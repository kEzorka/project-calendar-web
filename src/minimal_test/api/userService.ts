/**
 * СЕРВИС ПОИСКА ПОЛЬЗОВАТЕЛЕЙ
 * ИСПОЛЬЗУЕТСЯ В:
 * 
 * UserSearch.tsx:
 *   import { userService } from '../minimal_test/api/userService';
 *   import type { User } from '../minimal_test/types';
 *   
 *   // По ТЗ: query.length >= 2
 *   const handleSearch = async (query: string) => {
 *     if (query.length < 2) return;
 *     
 *     setLoading(true);
 *     const results = await userService.searchUsers(query);
 *     setUsers(results);
 *     setLoading(false);
 *   };
 * 
 * МЕТОД:
 * - searchUsers(query: string): Promise<User[]>
 *   Поиск по username, email, fullname
 * 
 * ЧТО УВИДИШЬ В КОНСОЛИ:
 * [MOCK] Searching users with query: "query"
 */

import type { User } from '../../types';

const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'impelix',
    email: 'impelix@pumpelix.love',
    full_name: 'Антон Импеликс',
    timezone: 'Europe/Moscow',
  },
  {
    id: 'user-2',
    username: 'genorto',
    email: 'wildberries-manger@dubai.com',
    full_name: 'Глеб Генорто',
    timezone: 'Europe/Moscow',
  },
  {
    id: 'user-3',
    username: 'kEzorka',
    email: 'kezorka@polyana.opushka',
    full_name: 'Костя Кезорка',
    timezone: 'Europe/Moscow',
  },
  {
    id: 'user-4',
    username: 'poil05',
    email: 'titlha@brdlha.mephi',
    full_name: 'Леша Титлха',
    timezone: 'Europe/Moscow',
  },
  {
    id: 'user-5',
    username: 'kis-kis',
    email: 'baby@cute.love',
    full_name: 'Федор Ноувей',
    timezone: 'Europe/Moscow',
  },
];

export const userService = {
  async searchUsers(query: string): Promise<User[]> {
    console.log('[MOCK] Searching users with query:', query);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || query.length < 2) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    const results = mockUsers.filter(user => 
      user.username.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.full_name.toLowerCase().includes(lowerQuery)
    );
    
    console.log('[MOCK] Found users:', results.length);
    return results;
  },
};
