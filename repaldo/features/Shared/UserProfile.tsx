

import React, { useState } from 'react';
import { User, Shield, Smartphone, Key, Mail, Bell, Lock, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

// Simula update federado
const updateUserFederated = async (data: any) => {
  await new Promise((res) => setTimeout(res, 1200));
  if (!data.name || !data.email) throw new Error('Dados obrigatórios');
  return { success: true };
};

export const UserProfilePage: React.FC = () => {
  const { user, setUser } = useAppStore();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleEdit = () => {
    setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    setEditOpen(true);
    setSuccess('');
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await updateUserFederated(form);
      setUser({ ...user, ...form });
      setSuccess('Dados atualizados com sucesso!');
      setEditOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
      {/* Modal de edição */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-blue-600" onClick={() => setEditOpen(false)}><X size={20}/></button>
            <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-bold mb-1">Nome</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">E-mail</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required type="email" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Telefone</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              {error && <div className="text-red-600 text-xs font-bold">{error}</div>}
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-32 h-32 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-blue-200">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{user?.name}</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">{user?.role} • {user?.nodeName}</p>
        </div>
        {success && <div className="text-green-600 text-xs font-bold mt-2">{success}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-8 shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2"><User size={20} className="text-blue-600"/> Dados Pessoais</h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">E-mail de Contato</label>
              <p className="font-bold text-slate-700">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Identificador Federado</label>
              <p className="font-mono text-xs text-slate-500">FED-USR-{user?.id.substring(0,8)}</p>
            </div>
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline" onClick={handleEdit}>Editar Informações</button>
          </div>
        </div>

        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 space-y-8">
          <h3 className="text-xl font-bold flex items-center gap-2"><Lock size={20} className="text-blue-600"/> Segurança</h3>
          <div className="space-y-4">
             <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">MFA Ativo</span>
                </div>
                <div className="w-10 h-6 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
             </div>
             <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Redefinir Senha</button>
          </div>
        </div>
      </div>
    </div>
  );
};
