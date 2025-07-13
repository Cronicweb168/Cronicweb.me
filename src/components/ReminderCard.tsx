import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Schedule, 
  Repeat, 
  Edit, 
  Delete,
  NotificationsActive 
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Card } from './Card';
import { Button } from './Button';
import { useStore } from '../store';
import type { Reminder } from '../types';

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onEdit }) => {
  const { toggleReminderComplete, deleteReminder } = useStore();

  const getPriorityColor = () => {
    switch (reminder.priority) {
      case 'high':
        return 'border-l-4 border-md-sys-color-error';
      case 'medium':
        return 'border-l-4 border-md-sys-color-secondary';
      case 'low':
        return 'border-l-4 border-md-sys-color-tertiary';
      default:
        return '';
    }
  };

  const getRepetitionIcon = () => {
    if (reminder.repetition === 'daily') return <Repeat className="text-sm" />;
    if (reminder.repetition === 'weekly') return <Repeat className="text-sm" />;
    return null;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        variant="filled" 
        className={`${getPriorityColor()} ${reminder.completed ? 'opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => toggleReminderComplete(reminder.id)}
            className="mt-1 text-md-sys-color-primary hover:text-md-sys-color-primary-container transition-colors"
          >
            {reminder.completed ? (
              <CheckCircle className="text-2xl" />
            ) : (
              <Circle className="text-2xl" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium text-md-sys-color-on-surface ${
              reminder.completed ? 'line-through' : ''
            }`}>
              {reminder.title}
            </h3>
            
            {reminder.description && (
              <p className="text-sm text-md-sys-color-on-surface-variant mt-1">
                {reminder.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 text-sm text-md-sys-color-on-surface-variant">
              <div className="flex items-center gap-1">
                <Schedule className="text-sm" />
                <span>{format(new Date(reminder.date), 'MMM dd')} at {reminder.time}</span>
              </div>
              
              {reminder.repetition !== 'once' && (
                <div className="flex items-center gap-1">
                  {getRepetitionIcon()}
                  <span className="capitalize">{reminder.repetition}</span>
                </div>
              )}

              {reminder.reminderBefore && (
                <div className="flex items-center gap-1">
                  <NotificationsActive className="text-sm" />
                  <span>{reminder.reminderBefore}min before</span>
                </div>
              )}
            </div>

            {reminder.tags && reminder.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {reminder.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="text"
              icon={<Edit />}
              onClick={onEdit}
              className="!p-2"
            />
            <Button
              variant="text"
              icon={<Delete />}
              onClick={() => deleteReminder(reminder.id)}
              className="!p-2 text-md-sys-color-error"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};