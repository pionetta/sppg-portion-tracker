import React from 'react';
import { ClayCard } from './ClayCard';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-150">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <ClayCard className="p-6 relative border-[#E5E5E5]">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1 pr-4">
              <h3 className="text-base font-bold text-[#111111]">{title}</h3>
              <p className="mt-1 text-sm text-[#666666] leading-relaxed">{message}</p>
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
        </ClayCard>
      </div>
    </div>
  );
};
