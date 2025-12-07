import { useState } from 'react';
import { CalendarView } from '../components/CalendarView';
import type { CalendarEvent, Task } from '../types';

export default function TestCalendarPage() {
    // Пример задачи
    const testTask: Task = {
        id: 'task-1',
        parent_task_id: null,
        title: 'Test Task',
        description: 'Just for testing',
        status: 'in_progress',
        priority: 'high',
        start_date: '2025-12-05',
        end_date: '2025-12-08',
        estimated_hours: 8,
    };

    // Пример событий
    const events: CalendarEvent[] = [
        {
            id: 'ev-1',
            title: 'Testing Event',
            start: new Date(2025, 11, 5),
            end: new Date(2025, 11, 8),
            resource: testTask,
        },
    ];

    const [selected, setSelected] = useState<CalendarEvent | null>(null);

    return (
        <div style={{ padding: 20 }}>
            <h1>Тест CalendarView</h1>

            <CalendarView
                events={events}
                onSelectEvent={(e) => {
                    console.log('Click event:', e);
                    setSelected(e);
                }}
                onRangeChange={(range) => {
                    console.log('Range changed:', range);
                }}
            />

            {selected && (
                <div style={{ marginTop: 20, padding: 10, background: '#eee' }}>
                    <strong>Выбрали задачу:</strong> {selected.title}
                </div>
            )}
        </div>
    );
}
