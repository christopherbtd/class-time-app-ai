import React from 'react';
import {AlertTriangle} from 'lucide-react';
import {Modal} from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel} maxWidthClass="max-w-md">
      <div className="flex items-start gap-3.5">
        <div
          className={`shrink-0 rounded-xl p-2.5 ${
            isDestructive
              ? 'bg-red-50 dark:bg-red-950/50 text-[#EF4444]'
              : 'bg-blue-50 dark:bg-blue-950/50 text-[#4778E8]'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm leading-relaxed text-[#475569] dark:text-slate-300">{message}</p>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-[#1E293B] dark:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            isDestructive
              ? 'bg-[#EF4444] text-white hover:bg-red-600'
              : 'bg-[#4778E8] text-white hover:bg-[#3B67D1]'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
