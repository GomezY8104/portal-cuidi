import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, FilePlus, Save, Activity, Clock, MapPin, Stethoscope, AlertTriangle } from 'lucide-react';

export const NewProcedureModal: React.FC = () => {
  const { closeModal, modalData } = useAppStore();
  const [formData, setFormData] = useState({
    type: 'EXAME',
    name: '',
    specialty: 'CLÍNICA GERAL',
    urgency: 'ROTINA',
    targetArea: 'LABORATÓRIO CENTRAL',
    justification: ''
  });

  const handleSave = () => {
    if (!formData.name) return alert('Informe o nome do procedimento.');
    
    if (modalData?.onConfirm) {
      modalData.onConfirm({
        ...formData,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }
    closeModal();
  };

  return (
    <div className="bg-white w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <FilePlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Novo Pedido</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SADT & Procedimentos</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
      </div>

      <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
        
        {/* Tipo e Nome */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo de Solicitação</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500"
              >
                 <option value="EXAME">Exame Laboratorial</option>
                 <option value="IMAGEM">Exame de Imagem</option>
                 <option value="PROCEDIMENTO">Procedimento / Intervenção</option>
                 <option value="PARECER">Parecer Especialista</option>
              </select>
           </div>
           <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome do Procedimento</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})}
                placeholder="EX: HEMOGRAMA, TC DE CRÂNIO..." 
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-xl text-xs font-black text-slate-900 outline-none focus:border-blue-500 transition-all uppercase placeholder:text-slate-300"
                autoFocus
              />
           </div>
        </div>

        {/* Detalhes Técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><Stethoscope size={12}/> Especialidade</label>
              <select 
                value={formData.specialty}
                onChange={e => setFormData({...formData, specialty: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500"
              >
                 <option>CLÍNICA GERAL</option>
                 <option>CARDIOLOGIA</option>
                 <option>ORTOPEDIA</option>
                 <option>NEUROLOGIA</option>
                 <option>PEDIATRIA</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><AlertTriangle size={12}/> Urgência</label>
              <select 
                value={formData.urgency}
                onChange={e => setFormData({...formData, urgency: e.target.value})}
                className={`w-full p-4 border rounded-xl text-xs font-black uppercase outline-none ${formData.urgency === 'EMERGÊNCIA' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                 <option value="ROTINA">Rotina (Até 24h)</option>
                 <option value="URGENTE">Urgente (Até 4h)</option>
                 <option value="EMERGÊNCIA">Emergência (Imediato)</option>
              </select>
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><MapPin size={12}/> Unidade Executora (Destino)</label>
           <select 
             value={formData.targetArea}
             onChange={e => setFormData({...formData, targetArea: e.target.value})}
             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-blue-500"
           >
              <option>LABORATÓRIO CENTRAL</option>
              <option>CENTRO DE IMAGEM (RAIO-X/TC)</option>
              <option>SALA DE PROCEDIMENTOS</option>
              <option>BLOCO CIRÚRGICO</option>
              <option>LEITO (BEIRA-LEITO)</option>
           </select>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Justificativa Clínica / Observações</label>
           <textarea 
             value={formData.justification}
             onChange={e => setFormData({...formData, justification: e.target.value})}
             placeholder="Indicação clínica..."
             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500 h-24 resize-none"
           />
        </div>

      </div>

      <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50">
         <button onClick={closeModal} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
         <button onClick={handleSave} className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-2">
            <Save size={16}/> Confirmar Pedido
         </button>
      </div>
    </div>
  );
};