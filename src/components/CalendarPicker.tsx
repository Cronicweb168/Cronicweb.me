import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addMonths, 
  subMonths,
  addDays,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Button } from './Button';

interface CalendarPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  onClose?: () => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ value, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState(value);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onChange(day);
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEEEE';

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm font-medium text-md-sys-color-on-surface-variant">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const rows: React.ReactElement[] = [];
    let days: React.ReactElement[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        const isTodayDate = isToday(day);

        days.push(
          <motion.button
            key={day.toString()}
            className={`
              relative h-10 w-10 rounded-full flex items-center justify-center
              transition-all duration-200 ${
                !isCurrentMonth
                  ? 'text-md-sys-color-on-surface-variant opacity-40'
                  : isSelected
                  ? 'bg-md-sys-color-primary text-md-sys-color-on-primary'
                  : isTodayDate
                  ? 'border-2 border-md-sys-color-primary text-md-sys-color-primary'
                  : 'text-md-sys-color-on-surface hover:bg-md-sys-color-primary hover:bg-opacity-8'
              }
            `}
            onClick={() => handleDateClick(cloneDay)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {format(day, 'd')}
          </motion.button>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days.splice(0)}
        </div>
      );
    }

    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-md-sys-color-surface-variant rounded-xl shadow-elevation-3 p-6 w-80">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="text"
          icon={<ChevronLeft />}
          onClick={handlePreviousMonth}
          className="!p-2"
        />
        
        <motion.h2 
          key={format(currentMonth, 'MMMM yyyy')}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="text-lg font-medium text-md-sys-color-on-surface"
        >
          {format(currentMonth, 'MMMM yyyy')}
        </motion.h2>
        
        <Button
          variant="text"
          icon={<ChevronRight />}
          onClick={handleNextMonth}
          className="!p-2"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.toString()}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          {renderDays()}
          {renderCells()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="filled" onClick={onClose}>
          OK
        </Button>
      </div>
    </div>
  );
};