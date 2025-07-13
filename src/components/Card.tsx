import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'filled' | 'elevated' | 'outlined';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'filled',
  className = '',
  onClick
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'card-elevated';
      case 'outlined':
        return 'bg-md-sys-color-surface rounded-lg p-4 border border-md-sys-color-outline';
      case 'filled':
      default:
        return 'card';
    }
  };

  const Component = onClick ? motion.div : 'div';
  const componentProps = onClick
    ? {
        onClick,
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        className: `${getVariantClasses()} cursor-pointer ${className}`
      }
    : {
        className: `${getVariantClasses()} ${className}`
      };

  return <Component {...componentProps}>{children}</Component>;
};