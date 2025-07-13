import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ClockPickerProps {
  value: string; // HH:MM format
  onChange: (time: string) => void;
  onClose?: () => void;
}

export const ClockPicker: React.FC<ClockPickerProps> = ({ value, onChange, onClose }) => {
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  const [selectedHour, setSelectedHour] = useState(parseInt(value.split(':')[0] || '12'));
  const [selectedMinute, setSelectedMinute] = useState(parseInt(value.split(':')[1] || '0'));
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  useEffect(() => {
    const time = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange(time);
  }, [selectedHour, selectedMinute, onChange]);

  const handleClockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    const angle = Math.atan2(y, x);
    const degrees = (angle * 180) / Math.PI + 90;
    const normalizedDegrees = degrees < 0 ? degrees + 360 : degrees;

    if (mode === 'hours') {
      const hour = Math.round(normalizedDegrees / 30) || 12;
      setSelectedHour(hour);
    } else {
      const minute = Math.round(normalizedDegrees / 6) * 5;
      setSelectedMinute(minute % 60);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    if (mode === 'hours') {
      setMode('minutes');
    }
  };

  const getNumberPosition = (index: number, total: number, radius: number) => {
    const angle = (index * 360) / total - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  const getHandRotation = () => {
    if (mode === 'hours') {
      return (selectedHour * 30) - 90;
    } else {
      return (selectedMinute * 6) - 90;
    }
  };

  return (
    <div className="bg-md-sys-color-surface-variant rounded-xl shadow-elevation-3 p-6 w-80">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            className={`text-4xl font-light transition-colors ${
              mode === 'hours' ? 'text-md-sys-color-primary' : 'text-md-sys-color-on-surface-variant'
            }`}
            onClick={() => setMode('hours')}
          >
            {selectedHour.toString().padStart(2, '0')}
          </button>
          <span className="text-4xl font-light text-md-sys-color-on-surface-variant">:</span>
          <button
            className={`text-4xl font-light transition-colors ${
              mode === 'minutes' ? 'text-md-sys-color-primary' : 'text-md-sys-color-on-surface-variant'
            }`}
            onClick={() => setMode('minutes')}
          >
            {selectedMinute.toString().padStart(2, '0')}
          </button>
        </div>
      </div>

      <div
        ref={clockRef}
        className="relative w-64 h-64 mx-auto bg-md-sys-color-surface rounded-full cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={isDragging ? handleClockClick : undefined}
        onClick={handleClockClick}
      >
        {/* Clock face */}
        <div className="absolute inset-2 rounded-full bg-md-sys-color-surface-variant">
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 bg-md-sys-color-primary rounded-full" />
          
          {/* Clock hand */}
          <motion.div
            className="absolute top-1/2 left-1/2 origin-left"
            animate={{ rotate: getHandRotation() }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: '40%', height: '2px', marginTop: '-1px' }}
          >
            <div className="w-full h-full bg-md-sys-color-primary rounded-full" />
            <div className="absolute -right-3 -top-3 w-8 h-8 bg-md-sys-color-primary rounded-full" />
          </motion.div>

          {/* Numbers */}
          <AnimatePresence mode="wait">
            {(mode === 'hours' ? hours : minutes).map((num, index) => {
              const position = getNumberPosition(
                index,
                mode === 'hours' ? 12 : 12,
                90
              );
              const isSelected =
                (mode === 'hours' && num === selectedHour) ||
                (mode === 'minutes' && num === selectedMinute);

              return (
                <motion.div
                  key={`${mode}-${num}`}
                  className={`absolute flex items-center justify-center w-10 h-10 -ml-5 -mt-5 rounded-full cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-md-sys-color-primary text-md-sys-color-on-primary'
                      : 'text-md-sys-color-on-surface hover:bg-md-sys-color-primary hover:bg-opacity-8'
                  }`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm font-medium">
                    {mode === 'hours' ? num : num.toString().padStart(2, '0')}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

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