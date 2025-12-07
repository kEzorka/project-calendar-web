# Минимальные файлы для ПЕРВОЙ НЕДЕЛИ

## Что здесь находится:

### ui/ - UI компоненты (5 штук)
- **Button.tsx** - кнопки
- **Input.tsx** - поле ввода (для поиска)
- **Card.tsx** - карточки
- **Modal.tsx** - модальное окно
- **Loader.tsx** - спиннер загрузки

### api/ - Сервисы с моковыми данными (2 штуки)
- **userService.ts** - поиск пользователей
- **taskService.ts** - получение задач

### types/ - TypeScript типы
- **index.ts** - User, Task, Assignment

## Для каких компонентов:

### 1. UserSearch
Нужны:
- `Input` - поле поиска
- `Card` - карточки пользователей
- `Loader` - индикатор загрузки
- `Button` - кнопка выбора
- `userService` - поиск пользователей
- `User` тип

### 2. TaskDetailModal
Нужны:
- `Modal` - модальное окно
- `Card` - обертка контента
- `Button` - кнопки управления
- `Loader` - если загрузка
- `taskService` - получение задачи
- `Task`, `Assignment` типы

## Что такое Mock?

**Mock = тестовые данные без backend**

Вместо запросов на сервер возвращаются готовые данные

## Как использовать:

```
// В UserSearch.tsx
import { Input } from '../minimal_test/ui/Input';
import { Card } from '../minimal_test/ui/Card';
import { Loader } from '../minimal_test/ui/Loader';
import { Button } from '../minimal_test/ui/Button';
import { userService } from '../minimal_test/api/userService';
import type { User } from '../minimal_test/types';
```

```
// В TaskDetailModal.tsx
import { Modal } from '../minimal_test/ui/Modal';
import { Card } from '../minimal_test/ui/Card';
import { Button } from '../minimal_test/ui/Button';
import { Loader } from '../minimal_test/ui/Loader';
import { taskService } from '../minimal_test/api/taskService';
import type { Task, Assignment } from '../minimal_test/types';
```

## Что увидишь в консоли (F12):

[MOCK] Searching users with query: "query"
[MOCK] Found users: 1
[MOCK] Get task by id: task-1
[MOCK] Get assignments for task: task-1

## После работы Сони:

Соня удалит эту папку и ты обновишь импорты:

```
// Было:
import { Button } from '../minimal_test/ui/Button';
```

```
// Станет:
import { Button } from '../components/ui/Button';
```
