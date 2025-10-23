import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, Undo2 } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  onUndo?: () => void;
  undoLabel?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: Partial<Toast>) => string;
  error: (message: string, options?: Partial<Toast>) => string;
  warning: (message: string, options?: Partial<Toast>) => string;
  info: (message: string, options?: Partial<Toast>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss
      const duration = newToast.duration ?? 0;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, options?: Partial<Toast>) =>
      addToast({ type: 'success', message, ...options }),
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<Toast>) =>
      addToast({ type: 'error', message, ...options }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<Toast>) =>
      addToast({ type: 'warning', message, ...options }),
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<Toast>) =>
      addToast({ type: 'info', message, ...options }),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// Toast Container Component
function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: Toast[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
}

// Individual Toast Item
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: {
      bg: 'bg-green-600/10',
      border: 'border-green-600/20',
      icon: 'text-green-400',
      text: 'text-green-400',
    },
    error: {
      bg: 'bg-red-600/10',
      border: 'border-red-600/20',
      icon: 'text-red-400',
      text: 'text-red-400',
    },
    warning: {
      bg: 'bg-amber-600/10',
      border: 'border-amber-600/20',
      icon: 'text-amber-400',
      text: 'text-amber-400',
    },
    info: {
      bg: 'bg-blue-600/10',
      border: 'border-blue-600/20',
      icon: 'text-blue-400',
      text: 'text-blue-400',
    },
  };

  const Icon = icons[toast.type];
  const colorScheme = colors[toast.type];

  return (
    <div
      className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg p-4 shadow-lg animate-slide-in-right min-w-80`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${colorScheme.icon} flex-shrink-0 mt-0.5`} />

        <div className="flex-1">
          <p className={`text-sm font-medium ${colorScheme.text}`}>{toast.message}</p>
          {toast.description && (
            <p className="text-sm text-gray-400 mt-1">{toast.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo?.();
                onClose();
              }}
              className="px-3 py-1 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded transition-colors flex items-center gap-1.5"
            >
              <Undo2 className="w-3 h-3" />
              {toast.undoLabel || 'Undo'}
            </button>
          )}

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
