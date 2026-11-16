import React from 'react';
import {AlertCircle, CheckCircle2, Info, X} from 'lucide-react';
import type {ToastMessage} from '../../types/classtime';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({toasts, onDismiss}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.tone === 'success'
            ? CheckCircle2
            : toast.tone === 'error'
              ? AlertCircle
              : Info;
        const toneClasses =
          toast.tone === 'success'
            ? 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300'
            : toast.tone === 'error'
              ? 'border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 text-red-800 dark:text-red-300'
              : 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-300';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${toneClasses}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{toast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
