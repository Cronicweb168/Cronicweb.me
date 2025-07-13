import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Add, 
  PlaylistPlay, 
  School, 
  Quiz,
  Notifications,
  Today,
  CalendarMonth,
  CheckCircle
} from '@mui/icons-material';
import { format, isToday, isTomorrow, isPast, isFuture, startOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ReminderCard } from '../components/ReminderCard';
import { ReminderForm } from '../components/ReminderForm';
import { ThemeToggle } from '../components/ThemeToggle';
import { useStore } from '../store';
import { NotificationService } from '../services/notifications';
import type { Reminder } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { reminders, selectedDate, setSelectedDate } = useStore();
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>();

  useEffect(() => {
    // Initialize notifications
    NotificationService.initialize();
    NotificationService.requestPermission();

    // Schedule all active reminders
    reminders
      .filter((r) => !r.completed && isFuture(new Date(r.date)))
      .forEach((reminder) => {
        NotificationService.scheduleReminder(reminder);
      });
  }, [reminders]);

  const groupReminders = () => {
    const today = startOfDay(new Date());
    const groups: { [key: string]: Reminder[] } = {
      today: [],
      upcoming: [],
      completed: [],
      past: []
    };

    reminders.forEach((reminder) => {
      const reminderDate = new Date(reminder.date);
      
      if (reminder.completed) {
        groups.completed.push(reminder);
      } else if (isToday(reminderDate)) {
        groups.today.push(reminder);
      } else if (isPast(reminderDate)) {
        groups.past.push(reminder);
      } else {
        groups.upcoming.push(reminder);
      }
    });

    // Sort each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    });

    return groups;
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowReminderForm(true);
  };

  const handleCloseForm = () => {
    setShowReminderForm(false);
    setEditingReminder(undefined);
  };

  const groups = groupReminders();
  const stats = {
    todayCount: groups.today.length,
    upcomingCount: groups.upcoming.length,
    completedCount: groups.completed.length,
    completionRate: reminders.length > 0 
      ? Math.round((groups.completed.length / reminders.length) * 100)
      : 0
  };

  return (
    <div className="min-h-screen bg-md-sys-color-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-md-sys-color-surface shadow-elevation-1">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium text-md-sys-color-on-surface">
              Study Reminder
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                icon={<Notifications />}
                onClick={() => NotificationService.testNotification()}
                className="!p-2"
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-md-sys-color-on-surface-variant">Today's Tasks</p>
                <p className="text-3xl font-bold text-md-sys-color-primary">{stats.todayCount}</p>
              </div>
              <Today className="text-4xl text-md-sys-color-primary opacity-20" />
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-md-sys-color-on-surface-variant">Upcoming</p>
                <p className="text-3xl font-bold text-md-sys-color-secondary">{stats.upcomingCount}</p>
              </div>
              <CalendarMonth className="text-4xl text-md-sys-color-secondary opacity-20" />
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-md-sys-color-on-surface-variant">Completed</p>
                <p className="text-3xl font-bold text-md-sys-color-tertiary">{stats.completedCount}</p>
              </div>
              <CheckCircle className="text-4xl text-md-sys-color-tertiary opacity-20" />
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-md-sys-color-on-surface-variant">Completion Rate</p>
                <p className="text-3xl font-bold text-md-sys-color-primary">{stats.completionRate}%</p>
              </div>
              <div 
                className="relative w-16 h-16"
                style={{
                  background: `conic-gradient(var(--md-sys-color-primary) ${stats.completionRate * 3.6}deg, var(--md-sys-color-surface-variant) 0deg)`
                }}
              >
                <div className="absolute inset-2 bg-md-sys-color-surface rounded-full" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant="filled"
            icon={<Add />}
            onClick={() => setShowReminderForm(true)}
          >
            New Reminder
          </Button>
          
          <Button
            variant="outlined"
            icon={<PlaylistPlay />}
            onClick={() => navigate('/youtube')}
          >
            YouTube Playlists
          </Button>
          
          <Button
            variant="outlined"
            icon={<School />}
            onClick={() => navigate('/planner')}
          >
            Study Planner
          </Button>
          
          <Button
            variant="outlined"
            icon={<Quiz />}
            onClick={() => navigate('/quizzes')}
          >
            Quizzes
          </Button>
        </div>

        {/* Reminders Sections */}
        <div className="space-y-8">
          {/* Today's Reminders */}
          {groups.today.length > 0 && (
            <section>
              <h2 className="text-xl font-medium text-md-sys-color-on-surface mb-4">
                Today
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {groups.today.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onEdit={() => handleEditReminder(reminder)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* Upcoming Reminders */}
          {groups.upcoming.length > 0 && (
            <section>
              <h2 className="text-xl font-medium text-md-sys-color-on-surface mb-4">
                Upcoming
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {groups.upcoming.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onEdit={() => handleEditReminder(reminder)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* Past Due Reminders */}
          {groups.past.length > 0 && (
            <section>
              <h2 className="text-xl font-medium text-md-sys-color-error mb-4">
                Past Due
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {groups.past.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onEdit={() => handleEditReminder(reminder)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* Completed Reminders */}
          {groups.completed.length > 0 && (
            <section>
              <h2 className="text-xl font-medium text-md-sys-color-on-surface-variant mb-4">
                Completed
              </h2>
              <div className="space-y-3 opacity-60">
                <AnimatePresence>
                  {groups.completed.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onEdit={() => handleEditReminder(reminder)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* Empty State */}
          {reminders.length === 0 && (
            <Card variant="elevated" className="text-center py-12">
              <p className="text-lg text-md-sys-color-on-surface-variant mb-4">
                No reminders yet
              </p>
              <Button
                variant="filled"
                icon={<Add />}
                onClick={() => setShowReminderForm(true)}
              >
                Create your first reminder
              </Button>
            </Card>
          )}
        </div>
      </main>

      {/* FAB */}
      <motion.div
        className="fixed bottom-6 right-6 z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="fab"
          icon={<Add />}
          onClick={() => setShowReminderForm(true)}
        />
      </motion.div>

      {/* Reminder Form Modal */}
      <AnimatePresence>
        {showReminderForm && (
          <ReminderForm
            reminder={editingReminder}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};