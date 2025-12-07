import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import type { CalendarEvent, Task } from '../types';

const locales = { ru };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const priorityColors: Record<string, string> = {
    low: '#82c7a5',
    medium: '#6fa8dc',
    high: '#f6b26b',
    critical: '#e06666',
};

interface CalendarViewProps {
    events: CalendarEvent[];
    onSelectEvent?: (e: CalendarEvent) => void;
    onRangeChange?: (range: any) => void;
}

export const CalendarView = ({
    events,
    onSelectEvent,
    onRangeChange,
}: CalendarViewProps) => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');

    // --- Стилизация событий ---
    const eventStyleGetter = (event: CalendarEvent) => {
        const task: Task | undefined = event.resource;
        const bg =
            task?.priority && priorityColors[task.priority]
                ? priorityColors[task.priority]
                : priorityColors.medium;

        return {
            style: {
                backgroundColor: bg,
                color: 'white',
                borderRadius: '6px',
                padding: '4px 6px',
                border: 'none',
                fontSize: '14px',
            },
        };
    };

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"

                date={currentDate}
                view={currentView}
                onView={(v: 'month' | 'week' | 'day') => setCurrentView(v as 'month' | 'week' | 'day')}

                onNavigate={(newDate: Date) => {
                    setCurrentDate(newDate);
                }}


                onRangeChange={(range: unknown) => {
                    if (onRangeChange) onRangeChange(range);
                }}

                onSelectEvent={onSelectEvent}
                eventPropGetter={eventStyleGetter}

                views={{
                    month: true,
                    week: true,
                    day: true,
                }}

                culture="ru"
                popup

                formats={{
                    monthHeaderFormat: (date: Date, culture: string | undefined, loc: any) =>
                        loc
                            .format(date, "LLLL yyyy", culture)
                            .replace(/^./, (c: string) => c.toUpperCase()),

                    dayHeaderFormat: (date: Date, culture: string | undefined, loc: any) =>
                        loc.format(date, "d LLLL", culture),

                    dayRangeHeaderFormat: (
                        { start, end }: { start: Date; end: Date },
                        culture: string | undefined,
                        loc: any
                    ) =>
                        `${loc.format(start, "d LLLL", culture)} — ${loc.format(end, "d LLLL yyyy", culture)}`,
                }}

                messages={{
                    next: 'След.',
                    previous: 'Назад',
                    today: 'Сегодня',
                    month: 'Месяц',
                    week: 'Неделя',
                    day: 'День',
                    showMore: (count: number) => `+${count} ещё`,
                }}
            />
        </div>
    );
};
