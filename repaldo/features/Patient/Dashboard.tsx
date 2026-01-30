
// Versión de paginaspaciente
import React from 'react';
import { 
  User, Shield, Bell, Activity, 
  ArrowRight, Heart, FileText, Lock,
  ChevronRight, Calendar, Info, FolderPlus,
  AlertTriangle, CheckCircle2, Clock, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { MOCK_DOC_REQUESTS } from '../../mocks/seed';

export const PatientDashboardPage: React.FC = () => {
  const { user, openDrawer } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3.5rem] p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Heart size={350} /></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/20">
            <Shield size={14} /> Portal do Cidadão SUS CUIDI
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
            Olá, <span className="text-blue-300">{user?.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-blue-100 text-xl font-medium leading-relaxed mb-10 opacity-90">
            Sua saúde federada em um só lugar. Controle seus dados, responda solicitações e mantenha seu histórico sempre atualizado e seguro.
          </p>
          <div className="flex flex-wrap gap-5">
            <button 
              onClick={() => navigate('/patient/history')}
              className="px-10 py-5 bg-white text-blue-900 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 hover:bg-blue-50"
            >
              Meu Histórico
            </button>
            <button 
              onClick={() => navigate('/patient/emergency')}
              className="px-10 py-5 bg-red-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-900/20"
            >
              Perfil de Emergência
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Document Requests Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-end px-2">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Solicitações de Documentos</h3>
                 <p className="text-slate-500 text-sm font-medium">Ações requeridas por reguladores para continuidade do cuidado.</p>
               </div>
               <button 
                 onClick={() => navigate('/patient/documents')}
                 className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2"
               >
                 Ver todas <ArrowRight size={14}/>
               </button>
            </div>
            
            <div className="space-y-4">
               {MOCK_DOC_REQUESTS.map((req) => (
                 <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8 border-l-8 border-l-amber-400">
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                       <FolderPlus size={32}/>
                     </div>
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                           <Clock size={12}/> Pendente
                         </span>
                         <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Até {new Date(req.dueDate).toLocaleDateString()}</span>
                       </div>
                       <h3 className="text-xl font-black text-slate-900">{req.documentType}</h3>
                       <p className="text-sm text-slate-500 font-medium">Requisitante: <strong className="text-slate-800">{req.requester}</strong></p>
                     </div>
                   </div>
                   <button 
                     onClick={() => openDrawer('UploadDocumentDrawer', { requestId: req.id, type: req.documentType })}
                     className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                   >
                     Anexar Agora <ChevronRight size={16}/>
                   </button>
                 </div>
               ))}
            </div>
          </section>

          {/* Consent Pending Section */}
          <section className="space-y-6">
             <div className="flex justify-between items-end px-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Autorizações de Acesso</h3>
               <button onClick={() => navigate('/patient/consents')} className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">Gerenciar <ArrowRight size={14}/></button>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Tudo em conformidade!</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Você não possui pedidos de acesso à sua ficha clínica pendentes de decisão.</p>
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><Bell size={22} className="text-blue-600"/> Alertas da Rede</h3>
            <div className="space-y-6">
              {[
                { label: 'Exame de Imagem', sub: 'Hospital das Clínicas • Publicado', color: 'blue', time: 'Há 2h' },
                { label: 'Acesso Federado', sub: 'UBS Norte consultou sua Identidade', color: 'emerald', time: 'Hoje' },
                { label: 'Receita Digital', sub: 'Novo medicamento disponível', color: 'indigo', time: 'Ontem' },
              ].map((a, i) => (
                <div key={i} className="flex gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-blue-50 hover:border-blue-100 cursor-pointer relative group">
                  <div className={`w-3 h-3 rounded-full mt-2 bg-${a.color}-500 shadow-lg shadow-${a.color}-200`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-black text-slate-900">{a.label}</p>
                      <span className="text-[9px] font-black text-slate-400 uppercase">{a.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{a.sub}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-5 border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all">Histórico de Atividade</button>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute -bottom-10 -left-10 opacity-10"><Lock size={150} /></div>
             <h3 className="text-xl font-black flex items-center gap-3"><ShieldCheck size={24} className="text-blue-400"/> Sua Soberania</h3>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">
               Cada acesso aos seus dados clínicos é registrado de forma imutável em nosso Ledger Federado. Você pode auditar esses acessos e revogar permissões a qualquer momento.
             </p>
             <button 
               onClick={() => navigate('/security')}
               className="w-full py-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
             >
               Centro de Segurança
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
