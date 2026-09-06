import React from 'react';
import { ClayButton } from './ClayButton';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'primary',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="clay-card-prominent p-6 relative bg-white/95 backdrop-blur-md border border-white/60">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            disabled={isLoading}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-2xl shrink-0 ${
                variant === 'danger'
                  ? 'bg-rose-100 text-rose-600 shadow-[0_4px_12px_rgba(244,63,94,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.8)]'
                  : 'bg-indigo-100 text-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.8)]'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1 pr-4">
              <h3 className="text-base font-black text-slate-800 tracking-tight">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed font-medium">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <ClayButton variant="secondary" onClick={onCancel} disabled={isLoading} size="sm">
              {cancelLabel}
            </ClayButton>
            <ClayButton
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
              isLoading={isLoading}
              size="sm"
            >
              {confirmLabel}
            </ClayButton>
          </div>
        </div>
      </div>
    </div>
  );
};
