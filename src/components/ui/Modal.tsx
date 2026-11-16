import React, {useEffect} from 'react';
import {X} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  maxWidthClass = 'max-w-lg',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidthClass} rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 p-6 shadow-[0_16px_36px_rgba(30,41,59,0.12)] dark:shadow-[0_16px_36px_rgba(2,6,23,0.6)] my-auto`}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
          <div>
            <h2
              id="modal-heading"
              className="text-lg font-semibold text-[#1E293B] dark:text-slate-100"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-[#475569] dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="rounded-lg p-2 text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-slate-100 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-5">{children}</div>
      </div>
    </div>
  );
};
