import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#0E1116]/95 text-white border-emerald-500/40 shadow-emerald-950/20'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-white border-rose-500/40 shadow-rose-950/20'
              : 'bg-[#161B22]/95 text-white border-slate-700 shadow-slate-950/20'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-sm font-medium leading-tight">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-0.5 -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
