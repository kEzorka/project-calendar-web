import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/Input';
import { Card } from './ui/Card.tsx';
import { Loader } from './ui/Loader.tsx';
import { userService } from '../minimal_test/api/userService';
import type { User } from '../types';

const SEARCH_DEBOUNCE_MS = 300;

interface UserSearchProps {
    onSelect: (user: User) => void;  // вызываем при выборе пользователя
    excludeIds?: string[]; // пользователи, которых нельзя использовать
}

export const UserSearch: React.FC<UserSearchProps> = ({ // обновляемся функц. компонент, принимающий пропсы
    onSelect,
    excludeIds = [],
}) => {
    const [query, setQuery] = useState(''); // query - текст, введенный в поле поиска
    const [users, setUsers] = useState<User[]>([]); // users — найденные пользователи
    const [loading, setLoading] = useState(false); // loading — показывает индикатор загрузки
    const [error, setError] = useState<string | null>(null); // error — текст ошибки при запросе

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null); // debounceRef хранит ID таймера, чтобы можно было отменять прошлый таймер

    useEffect(() => { // логика поиска пользователя (при каждом изменении query)
        if (query.length < 2) { // меньше 2 символов - не ищем
            setUsers([]);
            setError(null);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true); // новый таймер поиска
                setError(null);

                const results = await userService.searchUsers(query); // запрос к бэку на поиск пользователей
                const filtered = results.filter(u => !excludeIds.includes(u.id)); // если пользователь назначен на задачу - он скрывается

                setUsers(filtered); // сохранение
            } catch {
                setError('Не удалось загрузить пользователей');
            } finally {
                setLoading(false); // выключаем индикатор загрузки
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current); // чистим таймер при смене 
        };
    }, [query, excludeIds]);

    const handleSelect = (user: User) => {
        onSelect(user); // вызываем onSelect(user)
        setUsers([]); // вызываем setUsers
        setQuery(''); // очищаем поле поиска
    };

    return (
        <div className="relative w-full">
            <div className="text-sm font-medium text-gray-700 mb-1">
                Поиск пользователя
            </div>

            <Input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Введите имя или email..."
            />

            {loading && (
                <div className="mt-2">
                    <Loader />
                </div>
            )}

            {!loading && users.length > 0 && ( // dropdown
                <div className="absolute mt-2 w-full z-20 space-y-2">
                    {users.map(user => (
                        <Card
                            key={user.id}
                            hoverable
                            onClick={() => handleSelect(user)}
                        >
                            <div className="font-semibold">
                                {user.full_name ?? user.username ?? 'Неизвестный пользователь'}
                            </div>
                            <div className="text-sm text-gray-600">
                                {user.email ?? 'Нет email'}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && query.length >= 2 && users.length === 0 && !error && (
                <div className="mt-2 text-sm text-gray-600">Ничего не найдено</div>
            )}

            {error && (
                <div className="mt-2 text-sm text-red-500">{error}</div> // показать текст ошибки
            )}
        </div>
    );
};
