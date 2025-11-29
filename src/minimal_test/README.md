# Минимальные заглушки для тестирования

## Что здесь находится:

1. **ui/** - Минимальные UI компоненты (Button, Input, Card, Modal, Loader, Select, Checkbox)
2. **api/** - Заглушки API сервисов с моковыми данными
3. **types/** - Базовые TypeScript типы

## Удаление временных файлов:

Соня удалит эту папку, когда реализует полноценные компоненты из своего ТЗ.

## Что делать:
Используй импорты из текущей папки minimal_test:

```
import { Button } from '../minimal_test/ui/Button';
import { authService } from '../minimal_test/api/authService';
и другие
```

После того как Соня закончит, обновишь импорты на:

```
import { Button } from '../components/ui/Button';
import { authService } from '../api/authService';
и дргуие
```