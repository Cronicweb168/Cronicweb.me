import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LightMode, DarkMode, AutoMode } from '@mui/icons-material';
import { useStore } from '../store';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const themes: Array<{ value: 'light' | 'dark' | 'system'; icon: React.ReactNode; label: string }> = [
    { value: 'light', icon: <LightMode />, label: 'Light' },
    { value: 'dark', icon: <DarkMode />, label: 'Dark' },
    { value: 'system', icon: <AutoMode />, label: 'System' }
  ];

  return (
    <div className="relative bg-md-sys-color-surface-variant rounded-full p-1 flex">
      <motion.div
        className="absolute inset-y-1 bg-md-sys-color-primary rounded-full"
        animate={{
          x: theme === 'light' ? 0 : theme === 'dark' ? 40 : 80,
          width: 36
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
      
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            relative z-10 w-9 h-9 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${theme === value ? 'text-md-sys-color-on-primary' : 'text-md-sys-color-on-surface-variant hover:text-md-sys-color-on-surface'}
          `}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};