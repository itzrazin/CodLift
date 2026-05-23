import React, { useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  return { toasts, showToast };
};

export const ToastContainer = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg font-bold text-sm pointer-events-auto transition-all ${
          t.type === 'warning' ? 'bg-yellow text-navy border border-yellow/50' :
          t.type === 'error' ? 'bg-red-500 text-white' :
          'bg-purple text-white'
        }`}>
          {t.message}
        </div>
      ))}
    </div>
  );
};
