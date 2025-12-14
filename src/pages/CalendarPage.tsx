import { useEffect, useState, useCallback } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

import { CalendarView } from '../components/CalendarView';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { Loader } from '../components/ui/Loader';
import { Card } from '../components/ui/Card';

import { taskService } from '../api/taskService';
import type { CalendarEvent, Task } from '../types';
import { USE_MOCK } from '../mock';
import './CalendarPage.scss';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadEvents = useCallback(async (start: Date, end: Date) => {
    if (USE_MOCK) {
      try {
        setLoading(true);
        setError(null);

        const allTasks = await taskService.getTasks();

        const filtered = allTasks.filter((t) => {
          const startDate = new Date(t.start_date);
          const endDate = new Date(t.end_date);
          return startDate >= start && endDate <= end;
        });

        const mapped: CalendarEvent[] = filtered.map((t) => ({
          id: t.id,
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
      return;
    }

    // РЕАЛЬНЫЙ API режим (когда будет бэк)
    try {
      setLoading(true);
      setError(null);

      // const start_date = start.toISOString().split('T')[0];
      // const end_date = end.toISOString().split('T')[0];

      // TODO: когда бэк будет, раскомментить
      // const response = await apiClient.get('/calendar/tasks', {
      //     params: { start_date, end_date },
      // });

      // const mapped = response.data.map((t: any) => ({
      //     id: t.id,
      //     title: t.title,
      //     start: new Date(t.start_date),
      //     end: new Date(t.end_date),
      //     resource: t,
      // }));

      // setEvents(mapped);
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
          console.log('Редактировать задачу', taskId);
        }}
        onDelete={(taskId) => {
          console.log('Удалить задачу', taskId);
        }}
      />
    </div>
  );
}
