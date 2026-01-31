
import React from 'react';
import { useAppStore, Notification } from '../../store/useAppStore';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const Toast: React.FC<{ notification: Notification; onClose: (id: string) => void }> = ({ notification, onClose }) => {
  const getStyles = () => {
    switch (notification.type) {
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'error': return 'bg-red-50 border-red-200 text-red-900';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-900';
      default: return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle size={20} className="text-emerald-600" />;
      case 'error': return <AlertCircle size={20} className="text-red-600" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-600" />;
      default: return <Info size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border shadow-lg transition-all animate-in slide-in-from-right-10 duration-300 w-full md:w-96 pointer-events-auto ${getStyles()}`}>
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm font-bold leading-tight">{notification.message}</p>
      </div>
      <button onClick={() => onClose(notification.id)} className="shrink-0 text-current opacity-50 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none p-4 w-full md:w-auto items-end">
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} onClose={removeNotification} />
      ))}
    </div>
  );
};
