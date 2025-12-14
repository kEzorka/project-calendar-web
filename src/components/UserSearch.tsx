import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Loader } from './ui/Loader';
import { userService } from '../minimal_test/api/userService';
import type { User } from '../types';

const SEARCH_DEBOUNCE_MS = 300;

interface UserSearchProps {
  onSelect: (user: User) => void;
  excludeIds?: string[];
}

export const UserSearch: React.FC<UserSearchProps> = ({ onSelect, excludeIds = [] }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setUsers([]);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await userService.searchUsers(query);
        const filtered = results.filter((u) => !excludeIds.includes(u.id));

        setUsers(filtered);
      } catch {
        setError('Не удалось загрузить пользователей');
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, excludeIds]);

  const handleSelect = (user: User) => {
    onSelect(user);
    setUsers([]);
    setQuery('');
  };

  return (
    <div className="relative w-full">
      <div className="text-sm font-medium text-gray-700 mb-1">Поиск пользователя</div>

      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите имя или email..."
      />

      {loading && (
        <div className="mt-2">
          <Loader />
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="absolute mt-2 w-full z-20 space-y-2">
          {users.map((user) => (
            <Card key={user.id} hoverable onClick={() => handleSelect(user)}>
              <div className="font-semibold">
                {user.full_name ?? user.username ?? 'Неизвестный пользователь'}
              </div>
              <div className="text-sm text-gray-600">{user.email ?? 'Нет email'}</div>
            </Card>
          ))}
        </div>
      )}

      {!loading && query.length >= 2 && users.length === 0 && !error && (
        <div className="mt-2 text-sm text-gray-600">Ничего не найдено</div>
      )}

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};
