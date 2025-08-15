'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
          icon: '✓',
          iconBg: 'bg-emerald-600',
          border: 'border-emerald-300'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-500',
          icon: '✕',
          iconBg: 'bg-red-600',
          border: 'border-red-300'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
          icon: '⚠',
          iconBg: 'bg-orange-600',
          border: 'border-orange-300'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-sky-500 to-blue-500',
          icon: 'ℹ',
          iconBg: 'bg-sky-600',
          border: 'border-sky-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
          icon: '•',
          iconBg: 'bg-gray-600',
          border: 'border-gray-300'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="toast-enter">
      <div className={`${styles.bg} text-white rounded-2xl toast-shadow border ${styles.border} backdrop-blur-lg overflow-hidden max-w-sm relative`}>
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/20 w-full">
          <div className="h-full bg-white/60 toast-progress" />
        </div>

        <div className="p-4 flex items-center space-x-3">
          {/* Icon */}
          <div className={`w-10 h-10 ${styles.iconBg} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {styles.icon}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white hover:text-white transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/10 rounded-full"></div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// Toast Hook for easy usage
export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return {
    toast,
    showToast,
    hideToast
  };
}