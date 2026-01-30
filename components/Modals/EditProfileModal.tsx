
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  User, Mail, Smartphone, MapPin, 
  Camera, ShieldCheck, X, Check,
  Fingerprint, Save, Info
} from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { user, closeModal, setUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 98765-4321', // Mock
    address: 'Av. Paulista, 1000 - São Paulo, SP' // Mock
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (user) {
        setUser({ ...user, name: formData.name, email: formData.email });
      }
      setLoading(false);
      alert('Perfil atualizado com sucesso na federação!');
      closeModal();
    }, 1500);
  };

  return (
    <div className="bg-white overflow-hidden flex flex-col">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Editar Perfil</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Dados Federados SUS CUIDI</p>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto max-h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-28 h-28 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl transition-transform group-hover:scale-105">
              {formData.name.charAt(0)}
            </div>
            <button type="button" className="absolute bottom-0 right-0 p-3 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Camera size={20} />
            </button>
          </div>
          <div className="text-center">
             <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Identidade Verificada</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none font-bold transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Principal</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none font-bold transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefone (SMS)</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                value={formData.phone}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none font-bold text-slate-400" 
                readOnly
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Endereço Residencial</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                value={formData.address}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none font-bold text-slate-400" 
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4 text-amber-900">
           <Info size={24} className="shrink-0 text-amber-600" />
           <p className="text-xs font-medium leading-relaxed">
             Dados críticos como CPF, CNS e Endereço devem ser alterados presencialmente em uma unidade de saúde autorizada para garantir a integridade do seu perfil federado.
           </p>
        </div>
      </form>

      <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
        <button 
          type="button" 
          onClick={closeModal}
          className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-600 transition-all"
        >
          Cancelar
        </button>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
        >
          {loading ? 'Processando...' : <><Save size={16}/> Salvar Alterações</>}
        </button>
      </div>
    </div>
  );
};
