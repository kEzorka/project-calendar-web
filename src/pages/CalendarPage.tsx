import { useEffect, useState, useCallback } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

import { CalendarView } from '../components/CalendarView';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { Loader } from '../components/ui/Loader';
import { Card } from '../components/ui/Card';

import { apiClient } from '../api/client';
import type { CalendarEvent, Task } from '../types';
import { USE_MOCK } from '../mock';

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // const loadEvents = useCallback(async (start: Date, end: Date) => {
    //     try {
    //         setLoading(true);
    //         setError(null);

    //         const start_date = start.toISOString().split('T')[0];
    //         const end_date = end.toISOString().split('T')[0];

    //         const response = await apiClient.get('/calendar/tasks', {
    //             params: { start_date, end_date },
    //         });

    //         const raw = response.data;

    //         const mapped: CalendarEvent[] = raw.map((t: any) => ({
    //             id: t.task_id,
    //             title: t.title,
    //             start: new Date(t.start_date),
    //             end: new Date(t.end_date),
    //             resource: t, // Task объект
    //         }));

    //         setEvents(mapped);
    //     } catch {
    //         setError('Не удалось загрузить события календаря');
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    const loadEvents = useCallback(async (start: Date, end: Date) => {
        if (USE_MOCK) {
            // Моковые задачи
            const mockData = [
                {
                    task_id: '1',
                    title: 'Тестовая задача',
                    start_date: '2025-12-05',
                    end_date: '2025-12-06',
                    priority: 'high',
                    status: 'in_progress',
                },
                {
                    task_id: '2',
                    title: 'Еще одна задача',
                    start_date: '2025-12-03',
                    end_date: '2025-12-04',
                    priority: 'medium',
                    status: 'not_started',
                }
            ];

            const mapped = mockData.map((t: any) => ({
                id: t.task_id,
                title: t.title,
                start: new Date(t.start_date),
                end: new Date(t.end_date),
                resource: t,
            }));

            setEvents(mapped);
            return;
        }

        // --- обычный (API) режим, пока backend не реализован ---
        try {
            setLoading(true);
            setError(null);

            const start_date = start.toISOString().split('T')[0];
            const end_date = end.toISOString().split('T')[0];

            const response = await apiClient.get('/calendar/tasks', {
                params: { start_date, end_date },
            });

            const mapped = response.data.map((t: any) => ({
                id: t.task_id,
                title: t.title,
                start: new Date(t.start_date),
                end: new Date(t.end_date),
                resource: t,
            }));

            setEvents(mapped);
        } catch (e) {
            setError('Не удалось загрузить события календаря');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        const now = new Date();
        loadEvents(startOfMonth(now), endOfMonth(now));
    }, [loadEvents]);

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedTask(event.resource);
        setModalOpen(true);
    };

    const handleRangeChange = (range: unknown) => {
        if (Array.isArray(range)) {
            loadEvents(range[0], range[range.length - 1]);
        } else if (range && typeof range === 'object') {
            const r = range as { start: Date; end: Date };
            loadEvents(r.start, r.end);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ marginBottom: '16px' }}>Календарь</h1>

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <Loader size="lg" />
                </div>
            )}

            {error && (
                <Card className="error-card">
                    <p>{error}</p>
                </Card>
            )}

            {!loading && !error && (
                <CalendarView
                    events={events}
                    onSelectEvent={handleSelectEvent}
                    onRangeChange={handleRangeChange}
                />
            )}

            <TaskDetailModal
                task={selectedTask}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onEdit={(taskId) => {
                    console.log("Редактировать задачу", taskId);
                }}
                onDelete={(taskId) => console.log("Удалить", taskId)}
            />
        </div>
    );
}
