import React from 'react';

export type BannerType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

interface BannerNotificationProps {
  message: string;
  type?: BannerType;
  visible: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

export const BannerNotification: React.FC<BannerNotificationProps> = ({
  message,
  type = 'info',
  visible,
  onClose,
  onConfirm,
}) => {
  if (!visible) return null;

  const colorMap = {
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    confirm: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg border font-bold flex items-center gap-4 animate-in fade-in ${colorMap[type]}`}
      style={{ minWidth: 320, maxWidth: 480 }}>
      <span>{message}</span>
      {type === 'confirm' && onConfirm && (
        <>
          <button onClick={onConfirm} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded font-bold">Confirmar</button>
          <button onClick={onClose} className="ml-2 px-3 py-1 bg-slate-300 text-slate-800 rounded font-bold">Cancelar</button>
        </>
      )}
      {type !== 'confirm' && onClose && (
        <button onClick={onClose} className="ml-2 px-3 py-1 bg-slate-300 text-slate-800 rounded font-bold">Cerrar</button>
      )}
    </div>
  );
};
