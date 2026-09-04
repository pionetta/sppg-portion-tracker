import React from 'react';
import { ClayCard } from './ClayCard';
import { ClayButton } from './ClayButton';
import { Loader2, FolderOpen, AlertCircle, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Memuat data...',
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-200/80 mb-3">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
    <p className="text-sm font-medium text-neutral-600">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionLabel, onAction, icon }) => (
  <ClayCard className="py-12 px-6 text-center flex flex-col items-center justify-center">
    <div className="p-3.5 bg-neutral-100 text-neutral-500 rounded-2xl mb-3">
      {icon || <FolderOpen className="w-8 h-8" />}
    </div>
    <h3 className="text-base font-bold text-[#111111]">{title}</h3>
    {description && (
      <p className="mt-1 text-sm text-[#666666] max-w-xs">{description}</p>
    )}
    {actionLabel && onAction && (
      <div className="mt-4">
        <ClayButton variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </ClayButton>
      </div>
    )}
  </ClayCard>
);

export const ErrorState: React.FC<{
  message: string;
  onRetry?: () => void;
}> = ({ message, onRetry }) => (
  <ClayCard className="py-8 px-6 text-center flex flex-col items-center justify-center border-rose-200 bg-rose-50/40">
    <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl mb-3">
      <AlertCircle className="w-7 h-7" />
    </div>
    <h3 className="text-base font-bold text-rose-900">Terjadi Kesalahan</h3>
    <p className="mt-1 text-sm text-rose-700 max-w-sm">{message}</p>
    {onRetry && (
      <div className="mt-4">
        <ClayButton
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Coba Lagi
        </ClayButton>
      </div>
    )}
  </ClayCard>
);
