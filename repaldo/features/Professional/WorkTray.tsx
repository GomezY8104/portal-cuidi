
import React, { useState } from 'react';
import { 
  Search, Users, Activity, Filter, 
  ArrowRight, Heart, FileText, Lock,
  ChevronRight, Calendar, UserCheck,
  Stethoscope, Clock, ShieldAlert,
  MapPin, Globe
} from 'lucide-react';
import { MOCK_PATIENTS } from '../../mocks/seed';
import { useAppStore } from '../../store/useAppStore';
import { evaluateGovernance } from '../../services/governanceService';

export const WorkTrayPage: React.FC = () => {
  const { openDrawer, user } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const handlePatientAccess = (patient: any) => {
    // Aciona motor de governança para simular avaliação em tempo real
    const decision = evaluateGovernance({
      role: user?.role as any,
      orgId: user?.orgId as any,
      patientId: patient.id,
      dataType: 'CLINICAL',
      purpose: 'TREATMENT',
      action: 'VIEW_HISTORY'
    });

    openDrawer('GovernanceDecisionDrawer', {
      decision,
      patient,
      onConfirm: () => {
        alert('Acesso autorizado pelo Ledger Federado para ' + patient.name);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Activity size={14} /> Módulo Assistencial Federado
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bandeja de Trabalho</h1>
          <p className="text-slate-500 mt-1 text-lg">Busca federada de pacientes e continuidade do cuidado.</p>
        </div>
        <div className="flex gap-3">
           <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">Capacidade Nó</p>
                <p className="text-sm font-bold text-slate-900">12 vagas abertas</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users size={20}/></div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5"><Globe size={240} /></div>
        <div className="relative z-10 space-y-8">
           <div className="max-w-xl">
             <h3 className="text-2xl font-black text-white mb-4">Busca Nacional Federada</h3>
             <p className="text-slate-400 text-sm font-medium leading-relaxed">
               Pesquise pacientes em toda a rede SUS através do CPF ou CNS. O sistema validará automaticamente seu nível de acesso conforme a política LGPD do nó.
             </p>
           </div>
           
           <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
                <input 
                  type="text" 
                  placeholder="Nome, CPF ou Cartão SUS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 bg-slate-800 border-2 border-slate-700 rounded-3xl text-white text-xl outline-none focus:border-blue-500 transition-all font-medium placeholder:text-slate-600"
                />
              </div>
              <button className="px-10 py-6 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all">
                Pesquisar Rede
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center px-2">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Fila de Atendimento Local</h3>
             <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">Gerenciar Fila</button>
           </div>
           
           <div className="space-y-4">
             {MOCK_PATIENTS.map((patient, i) => (
               <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-prominent transition-all group">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                       {patient.name.charAt(0)}
                     </div>
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CNS: {patient.cns}</span>
                         <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Idade: 45 anos</span>
                       </div>
                       <h3 className="text-xl font-black text-slate-900 leading-tight">{patient.name}</h3>
                       <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-1">
                         <MapPin size={14}/> Último atendimento: Hospital Regional Sul
                       </p>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => handlePatientAccess(patient)}
                       className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                     >
                        <Lock size={14}/> Avaliar Governança
                     </button>
                     <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                       <ChevronRight size={20}/>
                     </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2"><Stethoscope size={20} className="text-blue-600"/> Consultas Agendadas</h3>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">{8 + i}:00</div>
                      <p className="text-sm font-bold text-slate-700">Paciente #{i * 142}</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100">
             <div className="flex items-center gap-2 text-amber-700 font-black text-[10px] uppercase tracking-widest mb-4">
                <ShieldAlert size={14} /> Protocolo de Segurança
             </div>
             <p className="text-xs text-amber-900/70 leading-relaxed font-medium">
               Lembre-se: Todo acesso a dados sensíveis é registrado no Ledger imutável e notificado ao paciente via SMS/Push.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
