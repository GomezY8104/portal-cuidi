
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, AlertTriangle, Check, HelpCircle } from 'lucide-react';

/**
 * Modal de Confirmação Genérico
 * Substitui window.confirm()
 * Espera modalData: { title, message, type: 'danger'|'info', onConfirm: () => void }
 */
export const ConfirmationModal: React.FC = () => {
  const { closeModal, modalData } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    if (modalData?.onConfirm) {
      modalData.onConfirm();
    }
    setLoading(false);
    closeModal();
  };

  const isDanger = modalData?.type === 'danger';

  return (
    <div className="bg-white w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl">
      <div className={`p-6 flex items-center gap-4 ${isDanger ? 'bg-red-50' : 'bg-slate-50'}`}>
        <div className={`p-3 rounded-full ${isDanger ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
          {isDanger ? <AlertTriangle size={24} /> : <HelpCircle size={24} />}
        </div>
        <div>
          <h3 className={`text-lg font-black uppercase ${isDanger ? 'text-red-900' : 'text-slate-900'}`}>
            {modalData?.title || 'Confirmação'}
          </h3>
        </div>
      </div>
      
      <div className="p-8">
        <p className="text-sm font-medium text-slate-600 leading-relaxed">
          {modalData?.message || 'Tem certeza que deseja prosseguir com esta ação?'}
        </p>
      </div>

      <div className="p-6 bg-slate-50 flex gap-3 justify-end border-t border-slate-100">
        <button 
          onClick={closeModal}
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase text-slate-500 hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={handleConfirm}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 ${isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-900 hover:bg-slate-800'}`}
        >
          {loading ? 'Processando...' : <>Confirmar <Check size={14}/></>}
        </button>
      </div>
    </div>
  );
};

/**
 * Modal de Input Genérico
 * Substitui window.prompt()
 * Espera modalData: { title, label, defaultValue, onConfirm: (value: string) => void }
 */
export const InputModal: React.FC = () => {
  const { closeModal, modalData } = useAppStore();
  const [value, setValue] = useState(modalData?.defaultValue || '');

  const handleConfirm = () => {
    if (modalData?.onConfirm) {
      modalData.onConfirm(value);
    }
    closeModal();
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-black text-slate-900 uppercase">
          {modalData?.title || 'Entrada de Dados'}
        </h3>
        <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X size={18}/></button>
      </div>
      
      <div className="p-8 space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
          {modalData?.label || 'Valor'}
        </label>
        <input 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-blue-500 transition-all"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
        />
      </div>

      <div className="p-6 bg-slate-50 flex gap-3 justify-end border-t border-slate-100">
        <button 
          onClick={closeModal}
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase text-slate-500 hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button 
          onClick={handleConfirm}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};
