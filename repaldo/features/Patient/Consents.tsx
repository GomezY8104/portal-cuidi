
import React from 'react';
import { 
  Shield, CheckCircle2, XCircle, 
  Search, Filter, Lock, Unlock, 
  AlertCircle, ChevronRight, Info,
  Plus, Settings2, Trash2, ShieldCheck,
  User, Activity, FileText, Pill, History,
  Image as ImageIcon, Video, Mic
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const PatientConsentsPage: React.FC = () => {
  const openModal = useAppStore(s => s.openModal);
  const navigate = useNavigate();

  const consents = [
    { 
      id: 'L-742',
      institution: 'Hospital das Clínicas', 
      type: 'PERSONALIZADO', 
      status: 'Ativo', 
      color: 'indigo',
      permissions: { id: true, clinical: true, exams: true, prescriptions: false, images: true, videos: false, audio: false }
    },
    { 
      id: 'L-129',
      institution: 'UBS Jardim Norte', 
      type: 'PLENO', 
      status: 'Ativo', 
      color: 'emerald',
      permissions: { id: true, clinical: true, exams: true, prescriptions: true, images: false, videos: false, audio: false }
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <ShieldCheck size={14} /> Governança Federada CUIDI
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Soberania de Dados</h1>
          <p className="text-slate-500 mt-1 text-lg font-medium">Você decide quem acessa o quê. Revogue permissões a qualquer momento.</p>
        </div>
        <button 
          onClick={() => openModal('NewConsentModal')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
           <Plus size={18} /> Nova Autorização
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consents.map((c, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-prominent transition-all group relative overflow-hidden flex flex-col">
            <div className={`absolute -right-4 -top-4 opacity-5 text-slate-900`}><Shield size={140} /></div>
            
            <div className="flex justify-between items-start mb-6">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {c.status}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => openModal('EditConsentModal', c)}
                  className="p-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-slate-400 shadow-sm"
                  title="Ajustar Configurações"
                >
                  <Settings2 size={18} />
                </button>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{c.institution}</h3>
            
            <div className="space-y-4 mb-8 flex-1 bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Privilégios Ativos:</p>
               <div className="flex flex-wrap gap-2">
                  <div className={`p-2 rounded-lg flex items-center gap-2 border ${c.permissions.id ? 'bg-white border-blue-200 text-blue-600' : 'opacity-20 grayscale'}`}><User size={12}/> <span className="text-[9px] font-bold">ID</span></div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 border ${c.permissions.clinical ? 'bg-white border-indigo-200 text-indigo-600' : 'opacity-20 grayscale'}`}><Activity size={12}/> <span className="text-[9px] font-bold">CLIN</span></div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 border ${c.permissions.exams ? 'bg-white border-emerald-200 text-emerald-600' : 'opacity-20 grayscale'}`}><FileText size={12}/> <span className="text-[9px] font-bold">EXAM</span></div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 border ${c.permissions.images ? 'bg-white border-purple-200 text-purple-600' : 'opacity-20 grayscale'}`}><ImageIcon size={12}/> <span className="text-[9px] font-bold">IMAG</span></div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 border ${c.permissions.videos ? 'bg-white border-rose-200 text-rose-600' : 'opacity-20 grayscale'}`}><Video size={12}/> <span className="text-[9px] font-bold">VID</span></div>
                  <div className={`p-2 rounded-lg flex items-center gap-2 border ${c.permissions.audio ? 'bg-white border-cyan-200 text-cyan-600' : 'opacity-20 grayscale'}`}><Mic size={12}/> <span className="text-[9px] font-bold">AUD</span></div>
               </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => openModal('RevokeConsentModal', c)}
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Revogar Permissões <Trash2 size={14} />
              </button>
              <button 
                onClick={() => navigate(`/ledger/${c.id}`)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 hover:text-indigo-600 transition-colors"
              >
                Ver Auditoria no Ledger <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><ShieldCheck size={300} /></div>
         <div className="relative z-10 flex-1">
           <h3 className="text-3xl font-black mb-4 leading-tight">Configurações Globais da Federação</h3>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
             Defina regras automáticas para toda a rede federada. Escolha quais dados deseja compartilhar por padrão com qualquer novo nó institucional.
           </p>
         </div>
         <button 
           onClick={() => openModal('GlobalConsentRulesModal')}
           className="relative z-10 px-10 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
         >
           <Settings2 size={18} /> Configurar Regras Gerais
         </button>
      </div>
    </div>
  );
};
