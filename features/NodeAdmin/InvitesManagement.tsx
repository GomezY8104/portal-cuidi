
import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Mail, 
  Clock, CheckCircle, XCircle, 
  RefreshCw, Trash2, Send, Filter,
  ExternalLink, UserPlus
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

/**
 * P15: Gestão de Convites (/node-admin/invites)
 * Administra tokens de convite enviados para novos profissionais da unidade.
 */
export const InvitesManagementPage: React.FC = () => {
  const { user: currentUser } = useAppStore();
  const nodeType = currentUser?.nodeName?.toUpperCase() || 'UNIDADE';

  // Gerador de Convites Mockados Contextuais
  const getContextInvites = () => {
    let list = [];
    if (nodeType.includes('HOSPITAL')) {
       list = [
         { id: 'inv-01', email: 'dr.novo.cardiologia@gmail.com', role: 'PROVIDER', status: 'PENDING', sentAt: '2024-10-25T10:00:00Z' },
         { id: 'inv-02', email: 'enf.uti.silva@hotmail.com', role: 'PROVIDER', status: 'ACCEPTED', sentAt: '2024-10-20T08:30:00Z' },
         { id: 'inv-03', email: 'auditoria.externa@consultoria.com', role: 'AUDITOR', status: 'EXPIRED', sentAt: '2024-10-01T15:45:00Z' },
       ];
    } else if (nodeType.includes('UBS') || nodeType.includes('APS')) {
       list = [
         { id: 'inv-01', email: 'acs.novo.bairro@gmail.com', role: 'APS', status: 'PENDING', sentAt: '2024-10-26T09:00:00Z' },
         { id: 'inv-02', email: 'enf.familia.costa@saude.gov', role: 'APS', status: 'ACCEPTED', sentAt: '2024-10-22T14:20:00Z' }
       ];
    } else if (nodeType.includes('UPA')) {
       list = [
         { id: 'inv-01', email: 'plantonista.pediatra@gmail.com', role: 'UPA', status: 'PENDING', sentAt: '2024-10-26T18:00:00Z' },
         { id: 'inv-02', email: 'tec.raiox.souza@gmail.com', role: 'UPA', status: 'PENDING', sentAt: '2024-10-25T11:00:00Z' },
         { id: 'inv-03', email: 'enf.triagem.noite@yahoo.com', role: 'UPA', status: 'ACCEPTED', sentAt: '2024-10-24T20:00:00Z' }
       ];
    } else {
       // Fallback
       list = [
         { id: 'inv-01', email: 'novo.usuario@email.com', role: 'PROVIDER', status: 'PENDING', sentAt: '2024-10-26T10:00:00Z' }
       ];
    }
    return list;
  };

  const [invites] = useState(getContextInvites());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <UserPlus size={14} /> Onboarding de Profissionais
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestão de Convites</h1>
          <p className="text-slate-500 mt-1 text-lg">Administre os tokens de acesso enviados para sua equipe.</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
           <Send size={18} /> Novo Convite
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Convites Pendentes', value: invites.filter(i => i.status === 'PENDING').length, icon: <Clock className="text-amber-500" /> },
          { label: 'Aceites (30d)', value: invites.filter(i => i.status === 'ACCEPTED').length, icon: <CheckCircle className="text-green-500" /> },
          { label: 'Expirados', value: invites.filter(i => i.status === 'EXPIRED').length, icon: <XCircle className="text-red-500" /> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar por e-mail..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none" />
          </div>
          <button className="w-full md:w-auto px-6 py-3 border border-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50">
            <Filter size={18} /> Todos Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destinatário</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Papel Proposto</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enviado em</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invites.map((invite) => (
                <tr key={invite.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Mail size={18} />
                      </div>
                      <span className="font-bold text-slate-900">{invite.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-tighter">{invite.role}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      invite.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 
                      invite.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {invite.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                    {new Date(invite.sentAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {invite.status === 'PENDING' && (
                        <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg" title="Reenviar Convite">
                          <RefreshCw size={18} />
                        </button>
                      )}
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg" title="Revogar">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invites.length === 0 && (
                 <tr><td colSpan={5} className="px-8 py-10 text-center text-slate-400 italic text-xs uppercase font-bold">Nenhum convite encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
