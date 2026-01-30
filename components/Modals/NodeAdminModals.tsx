import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, UserPlus, Send, Copy, Check, Server, Save, 
  Trash2, Globe, Shield, Activity, RefreshCw 
} from 'lucide-react';

export const NodeAdminModals: React.FC = () => {
  const { activeModal, closeModal, modalData } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Invite User Logic
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'PROVIDER', unit: 'Hospital Central' });
  const [inviteToken, setInviteToken] = useState('');

  // Edit Endpoint Logic
  const [endpointForm, setEndpointForm] = useState(modalData || { name: '', url: '', method: 'GET', active: true });

  const isInvite = activeModal === 'InviteUserModal';
  const isEndpoint = activeModal === 'EditEndpointModal';

  const handleInvite = () => {
    setLoading(true);
    // Simula creación en backend y generación de token
    setTimeout(() => {
      setInviteToken(`INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(inviteToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEndpoint = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        alert('Configuração de endpoint atualizada com sucesso.');
        closeModal();
    }, 1000);
  };

  if (isInvite) {
    return (
      <div className="bg-white w-full max-w-lg mx-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg"><UserPlus size={20}/></div>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Novo Usuário</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adicionar à equipe local</p>
             </div>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
        </div>

        <div className="p-8">
           {step === 1 ? (
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Completo</label>
                   <input 
                    value={inviteForm.name}
                    onChange={e => setInviteForm({...inviteForm, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-blue-500 transition-all"
                    placeholder="Ex: Dr. João Silva"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Email Corporativo</label>
                   <input 
                    value={inviteForm.email}
                    onChange={e => setInviteForm({...inviteForm, email: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-blue-500 transition-all"
                    placeholder="joao@hospital.br"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Função (Role)</label>
                      <select 
                        value={inviteForm.role}
                        onChange={e => setInviteForm({...inviteForm, role: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      >
                         <option value="PROVIDER">PRESTADOR</option>
                         <option value="REGULATOR">REGULADOR</option>
                         <option value="APS">OPERADOR APS</option>
                         <option value="UPA">OPERADOR UPA</option>
                         <option value="NODE_ADMIN">ADMINISTRADOR</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Unidade</label>
                      <input 
                        value={inviteForm.unit}
                        onChange={e => setInviteForm({...inviteForm, unit: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-blue-500 transition-all"
                      />
                   </div>
                </div>
                <button 
                  onClick={handleInvite}
                  disabled={loading || !inviteForm.email || !inviteForm.name}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {loading ? <RefreshCw className="animate-spin" size={18}/> : <><Send size={18}/> Criar Usuário e Gerar Token</>}
                </button>
             </div>
           ) : (
             <div className="text-center space-y-6 animate-in zoom-in">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200"><Check size={32} strokeWidth={4}/></div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Usuário Criado (Pending)</h3>
                   <p className="text-slate-500 text-xs font-medium mt-1 max-w-xs mx-auto">Envie este token para o funcionário completar o cadastro.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4">
                   <code className="font-mono text-lg font-black text-blue-600 tracking-wider">{inviteToken}</code>
                   <button onClick={copyToken} className="p-2 bg-white rounded-lg border border-slate-200 hover:text-blue-600 transition-colors shadow-sm">
                      {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
                   </button>
                </div>
                <button onClick={closeModal} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900">Concluir</button>
             </div>
           )}
        </div>
      </div>
    );
  }

  if (isEndpoint) {
      return (
        <div className="bg-white w-full max-w-lg mx-auto">
           {/* ... existing endpoint modal code ... */}
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg"><Server size={20}/></div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Editar Endpoint</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuração de Gateway</p>
                 </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
           </div>

           <div className="p-8 space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nome do Serviço</label>
                 <input 
                    value={endpointForm.name} 
                    onChange={e => setEndpointForm({...endpointForm, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-blue-500"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">URL Pública</label>
                 <div className="relative">
                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                       value={endpointForm.url} 
                       onChange={e => setEndpointForm({...endpointForm, url: e.target.value})}
                       className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-blue-600 outline-none focus:border-blue-500"
                    />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Método</label>
                    <select 
                       value={endpointForm.method} 
                       onChange={e => setEndpointForm({...endpointForm, method: e.target.value})}
                       className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
                    >
                       <option>GET</option>
                       <option>POST</option>
                       <option>PUT</option>
                       <option>DELETE</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                    <button 
                       onClick={() => setEndpointForm({...endpointForm, active: !endpointForm.active})}
                       className={`w-full p-4 rounded-xl font-black text-xs uppercase tracking-widest border-2 transition-all ${endpointForm.active ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                    >
                       {endpointForm.active ? 'ATIVO' : 'INATIVO'}
                    </button>
                 </div>
              </div>

              <div className="pt-4 flex gap-4">
                 <button className="flex-1 py-4 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2"><Trash2 size={16}/> Remover</button>
                 <button 
                    onClick={handleSaveEndpoint}
                    disabled={loading}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                 >
                    {loading ? <RefreshCw className="animate-spin" size={18}/> : <><Save size={18}/> Salvar Alterações</>}
                 </button>
              </div>
           </div>
        </div>
      );
  }

  return null;
};