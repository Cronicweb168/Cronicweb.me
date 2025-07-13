import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AccessTime, 
  CalendarToday, 
  Repeat, 
  Label, 
  NotificationsActive,
  Close 
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Button } from './Button';
import { Card } from './Card';
import { ClockPicker } from './ClockPicker';
import { CalendarPicker } from './CalendarPicker';
import { useStore } from '../store';
import type { Reminder } from '../types';

interface ReminderFormProps {
  reminder?: Reminder;
  onClose: () => void;
}

export const ReminderForm: React.FC<ReminderFormProps> = ({ reminder, onClose }) => {
  const { addReminder, updateReminder } = useStore();
  const [showClockPicker, setShowClockPicker] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  
  const [formData, setFormData] = useState({
    title: reminder?.title || '',
    description: reminder?.description || '',
    date: reminder?.date || new Date(),
    time: reminder?.time || '09:00',
    repetition: reminder?.repetition || 'once' as 'once' | 'daily' | 'weekly',
    tags: reminder?.tags || [] as string[],
    priority: reminder?.priority || 'medium' as 'low' | 'medium' | 'high',
    reminderBefore: reminder?.reminderBefore || 15,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reminderData: Reminder = {
      id: reminder?.id || crypto.randomUUID(),
      ...formData,
      completed: reminder?.completed || false,
      createdAt: reminder?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (reminder) {
      updateReminder(reminder.id, reminderData);
    } else {
      addReminder(reminderData);
    }

    onClose();
  };

  const repetitionOptions = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-md-sys-color-tertiary' },
    { value: 'medium', label: 'Medium', color: 'text-md-sys-color-secondary' },
    { value: 'high', label: 'High', color: 'text-md-sys-color-error' },
  ];

  const reminderOptions = [5, 10, 15, 30, 60];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
      >
        <Card variant="elevated" className="p-0">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-xl font-medium text-md-sys-color-on-surface">
              {reminder ? 'Edit Reminder' : 'New Reminder'}
            </h2>
            <Button
              variant="text"
              icon={<Close />}
              onClick={onClose}
              className="!p-2"
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Reminder title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-outlined"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-outlined resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                className="input-outlined cursor-pointer flex items-center gap-2"
                onClick={() => setShowCalendarPicker(true)}
              >
                <CalendarToday className="text-md-sys-color-primary" />
                <span>{format(formData.date, 'MMM dd, yyyy')}</span>
              </div>

              <div 
                className="input-outlined cursor-pointer flex items-center gap-2"
                onClick={() => setShowClockPicker(true)}
              >
                <AccessTime className="text-md-sys-color-primary" />
                <span>{formData.time}</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-md-sys-color-on-surface-variant">
                <Repeat /> Repeat
              </label>
              <div className="flex gap-2">
                {repetitionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, repetition: option.value as any })}
                    className={`
                      px-4 py-2 rounded-full transition-all
                      ${formData.repetition === option.value
                        ? 'bg-md-sys-color-primary text-md-sys-color-on-primary'
                        : 'bg-md-sys-color-surface-variant text-md-sys-color-on-surface-variant hover:bg-md-sys-color-primary hover:bg-opacity-8'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-md-sys-color-on-surface-variant">
                <Label /> Priority
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value as any })}
                    className={`
                      px-4 py-2 rounded-full transition-all
                      ${formData.priority === option.value
                        ? 'bg-md-sys-color-primary text-md-sys-color-on-primary'
                        : 'bg-md-sys-color-surface-variant text-md-sys-color-on-surface-variant hover:bg-md-sys-color-primary hover:bg-opacity-8'
                      }
                    `}
                  >
                    <span className={option.color}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-md-sys-color-on-surface-variant">
                <NotificationsActive /> Remind me before
              </label>
              <select
                value={formData.reminderBefore}
                onChange={(e) => setFormData({ ...formData, reminderBefore: parseInt(e.target.value) })}
                className="input-outlined"
              >
                {reminderOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes < 60 ? `${minutes} minutes` : `${minutes / 60} hour${minutes > 60 ? 's' : ''}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="text" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="filled">
                {reminder ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showClockPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setShowClockPicker(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <ClockPicker
                value={formData.time}
                onChange={(time) => setFormData({ ...formData, time })}
                onClose={() => setShowClockPicker(false)}
              />
            </div>
          </motion.div>
        )}

        {showCalendarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setShowCalendarPicker(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <CalendarPicker
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                onClose={() => setShowCalendarPicker(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};