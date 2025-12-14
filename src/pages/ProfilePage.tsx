import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import type { User, Task, WorkScheduleDay } from '../types';
import { apiClient } from '../api/client';
import { USE_MOCK } from '../mock';
import './ProfilePage.scss';
import { fakeLoadProfileData } from './ProfilePage_test_data.mock.ts';

const DAY_NAMES: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье',
};

const formatStatusLabel = (status: Task['status'] | string) => {
    switch (status) {
        case 'pending':
            return 'Ожидает';
        case 'in_progress':
            return 'В работе';
        case 'completed':
            return 'Выполнено';
        case 'cancelled':
            return 'Отменено';
        default:
            return String(status);
    }
};

const getAllocatedHours = (task: Task): number => {
    const raw = (task as any).allocated_hours;
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
};

type ProfileTabId = 'info' | 'schedule' | 'stats' | 'projects' | 'tasks';

const PROFILE_TABS: { id: ProfileTabId; label: string }[] = [
    { id: 'info', label: 'Профиль' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'stats', label: 'Статистика' },
    { id: 'projects', label: 'Мои проекты' },
    { id: 'tasks', label: 'Мои задачи' },
];

export const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [workSchedule, setWorkSchedule] = useState<WorkScheduleDay[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const [activeTab, setActiveTab] = useState<ProfileTabId>('info');

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (USE_MOCK) {
                    const data = await fakeLoadProfileData();
                    if (!isMounted) return;

                    setUser(data.user);
                    setWorkSchedule(data.workSchedule || []);
                    setTasks(data.tasks || []);
                    return;
                }

                const meResp = await apiClient.get<User>('/auth/me');
                if (!isMounted) return;
                const currentUser = meResp.data;
                setUser(currentUser);

                const [scheduleResp, tasksResp] = await Promise.all([
                    apiClient.get<WorkScheduleDay[]>(
                        `/users/${currentUser.id}/work-schedule`
                    ),
                    apiClient.get<Task[]>('/tasks', {
                        params: { assigned_to: 'me' },
                    }),
                ]);

                if (!isMounted) return;

                setWorkSchedule(scheduleResp.data || []);
                setTasks(tasksResp.data || []);
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError('Не удалось загрузить данные профиля. Попробуйте обновить страницу.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDayClick = (day: WorkScheduleDay) => {
        setSelectedDay(day.day_of_week);
    };

    const projectTasks = tasks.filter((t) => t.parent_task_id === null);
    const projectsCount = projectTasks.length;
    const activeTasksCount = tasks.filter((t) => t.status === 'in_progress').length;
    const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

    const totalAllocatedHours = tasks.reduce((sum, t) => sum + getAllocatedHours(t), 0);

    const formattedTotalHours =
        totalAllocatedHours % 1 === 0
            ? totalAllocatedHours.toString()
            : totalAllocatedHours.toFixed(1);

    const sortedProjects = [...projectTasks].sort((a, b) =>
        (a.title || '').localeCompare(b.title || '', 'ru')
    );

    if (loading) {
        return (
            <div className="profile-page profile-page--loading">
                <Loader size="lg" text="Загружаем профиль..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <h1 className="profile-page__title">Профиль</h1>
                <Card className="profile-page__error">
                    <p>{error}</p>
                </Card>
            </div>
        );
    }

    const avatarLetter =
        (user?.full_name && user.full_name.trim()[0]) ||
        (user?.username && user.username.trim()[0]) ||
        '?';

    return (
        <div className="profile-page">
            <h1 className="profile-page__title">Профиль</h1>

            <div className="profile-page__layout">
                {/* Боковая панель с профилем пользователя */}
                <aside className="profile-page__sidebar">
                    {user && (
                        <div
                            className="profile-page__user"
                            aria-label={user.full_name || user.username}
                        >
                            <div className="profile-page__avatar" aria-hidden="true">
                                {avatarLetter.toUpperCase()}
                            </div>
                            <div className="profile-page__user-meta">
                                <div className="profile-page__user-name">
                                    {user.full_name || user.username}
                                </div>
                                <div className="profile-page__user-username">
                                    @{user.username}
                                </div>
                            </div>
                        </div>
                    )}

                    <nav className="profile-tabs" aria-label="Разделы профиля">
                        {PROFILE_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                className={
                                    'profile-tabs__btn' +
                                    (activeTab === tab.id ? ' profile-tabs__btn--active' : '')
                                }
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="profile-tabs__bullet" />
                                <span className="profile-tabs__label">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                {/* Основная область контента */}

                <main className="profile-page__content">
                    {activeTab === 'info' && (
                        <Card className="profile-page__section" title="Информация о пользователе">
                            <div className="profile-info">
                                <div className="profile-info__row">
                                    <span className="profile-info__label">ФИО</span>
                                    <span className="profile-info__value">
                                        {user?.full_name || '—'}
                                    </span>
                                </div>
                                <div className="profile-info__row">
                                    <span className="profile-info__label">Username</span>
                                    <span className="profile-info__value">
                                        @{user?.username || '—'}
                                    </span>
                                </div>
                                <div className="profile-info__row">
                                    <span className="profile-info__label">Email</span>
                                    <span className="profile-info__value">
                                        {user?.email || '—'}
                                    </span>
                                </div>
                                <div className="profile-info__row">
                                    <span className="profile-info__label">Часовой пояс</span>
                                    <span className="profile-info__value">
                                        {user?.timezone || '—'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'schedule' && (
                        <Card className="profile-page__section" title="Рабочее расписание">
                            {workSchedule.length === 0 ? (
                                <p className="profile-empty">Расписание не задано</p>
                            ) : (
                                <table className="schedule-table">
                                    <thead>
                                        <tr>
                                            <th>День</th>
                                            <th>Время</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workSchedule.map((day) => {
                                            const isSelected = selectedDay === day.day_of_week;
                                            return (
                                                <tr
                                                    key={day.day_of_week}
                                                    className={
                                                        'schedule-table__row' +
                                                        (isSelected
                                                            ? ' schedule-table__row--selected'
                                                            : '')
                                                    }
                                                    onClick={() => handleDayClick(day)}
                                                >
                                                    <td className="schedule-table__day">
                                                        {DAY_NAMES[day.day_of_week] ||
                                                            `День ${day.day_of_week}`}
                                                    </td>
                                                    <td className="schedule-table__time">
                                                        {day.is_working_day ? (
                                                            <span className="schedule-table__badge schedule-table__badge--work">
                                                                {day.start_time} — {day.end_time}
                                                            </span>
                                                        ) : (
                                                            <span className="schedule-table__badge schedule-table__badge--off">
                                                                Выходной
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </Card>
                    )}

                    {activeTab === 'stats' && (
                        <Card className="profile-page__section" title="Статистика">
                            {tasks.length === 0 ? (
                                <p className="profile-empty">Нет задач для статистики</p>
                            ) : (
                                <div className="stats-grid">
                                    <div className="stats-card">
                                        <div className="stats-card__label">Проектов</div>
                                        <div className="stats-card__value">{projectsCount}</div>
                                        <div className="stats-card__hint">
                                            Все верхнеуровневые задачи
                                        </div>
                                    </div>
                                    <div className="stats-card">
                                        <div className="stats-card__label">Активных задач</div>
                                        <div className="stats-card__value">{activeTasksCount}</div>
                                        <div className="stats-card__hint">
                                            Со статусом «В работе»
                                        </div>
                                    </div>
                                    <div className="stats-card">
                                        <div className="stats-card__label">Завершённых задач</div>
                                        <div className="stats-card__value">{completedTasksCount}</div>
                                        <div className="stats-card__hint">Выполненные задачи</div>
                                    </div>
                                    <div className="stats-card">
                                        <div className="stats-card__label">Всего часов</div>
                                        <div className="stats-card__value">{formattedTotalHours}</div>
                                        <div className="stats-card__hint">Сумма по всем задачам</div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {activeTab === 'projects' && (
                        <Card className="profile-page__section" title="Мои проекты">
                            {sortedProjects.length === 0 ? (
                                <p className="profile-empty">Пока нет проектов</p>
                            ) : (
                                <ul className="projects-list">
                                    {sortedProjects.map((p) => (
                                        <li key={p.id} className="projects-list__item">
                                            <div className="projects-list__header">
                                                <span className="projects-list__title">
                                                    {p.title}
                                                </span>
                                                <span
                                                    className={`task-status-badge task-status-badge--${p.status}`}
                                                >
                                                    {formatStatusLabel(p.status)}
                                                </span>
                                            </div>
                                            {p.description && (
                                                <p className="projects-list__description">
                                                    {p.description}
                                                </p>
                                            )}
                                            <a className="projects-list__link" href={`/projects/${p.id}`}>
                                                Открыть проект
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    )}

                    {activeTab === 'tasks' && (
                        <Card className="profile-page__section" title="Мои задачи">
                            {tasks.length === 0 ? (
                                <p className="profile-empty">Пока нет задач</p>
                            ) : (
                                <ul className="task-list">
                                    {tasks.map((t) => (
                                        <li key={t.id} className="task-list__item">
                                            <div className="task-list__main">
                                                <span className="task-list__title">{t.title}</span>
                                                <span
                                                    className={`task-status-badge task-status-badge--${t.status}`}
                                                >
                                                    {formatStatusLabel(t.status)}
                                                </span>
                                            </div>
                                            {t.description && (
                                                <p className="task-list__description">
                                                    {t.description}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
};
