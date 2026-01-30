import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, FileText, Globe, Activity, 
  Lock, Eye, User, Zap, Download, History, CheckCircle, Database
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const ProviderCaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { openDrawer } = useAppStore();
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState<'RESUMO' | 'DOCS' | 'GOV' | 'TIMELINE'>('RESUMO');

  const caseData = {
    id: id || 'UPA-901',
    patient: {
      nome: 'MANOEL GOMES DA SILVA',
      cpf: '123.456.789-00',
      cns: '700000123456789',
      nascimento: '12/05/1966',
      idade: 58
    },
    clinico: {
      especialidade: 'CARDIOLOGIA CLÍNICA',
      cid10: 'I21.9 - INFARTO AGUDO DO MIOCÁRDIO',
      origem: 'UPA CENTRO - REGIONAL 01',
      solicitante: 'ENF. CARLA LIMA',
      justificativa: 'Paciente apresenta dor precordial tipo queimação há 3 horas, irradiada para membro superior esquerdo. Troponina positiva no nó de origem. Histórico de HAS severa.'
    }
  };

  const docs = [
    { nome: 'ECG Admissão (DICOM)', node: 'UPA CENTRO', data: 'HOJE, 09:00', tipo: 'EXAME' },
    { nome: 'Troponina I Sérica', node: 'LAB CENTRAL', data: 'HOJE, 10:15', tipo: 'LAUDO' }
  ];

  return (
    <div className="animate-fade-in-up pb-20 space-y-8 max-w-[1400px] mx-auto px-4 uppercase font-sans">
      {/* HEADER TÉCNICO */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/provider')} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-700 uppercase tracking-widest">Aguardando Avaliação</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">PROTOCOLO: #{caseData.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{caseData.patient.nome}</h1>
          </div>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={() => navigate(`/provider/case/${id}/attendance`)}
             className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
           >
              Avaliar Aceite <Zap size={16} fill="currentColor"/>
           </button>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
          {/* TAB NAVIGATION */}
          <div className="flex border-b border-slate-100 bg-slate-50/30">
            {[
              { id: 'RESUMO', label: 'Resumo Clínico', icon: <FileText size={16}/> },
              { id: 'DOCS', label: 'Histórico Técnico Federado', icon: <Download size={16}/> },
              { id: 'GOV', label: 'Governança Ativa', icon: <ShieldCheck size={16}/> },
              { id: 'TIMELINE', label: 'Timeline do Caso', icon: <History size={16}/> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-6 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border-r border-slate-100 transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 border-b-4 border-b-blue-600 shadow-sm' : 'text-slate-400 hover:bg-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-10 space-y-12">
              {activeTab === 'RESUMO' && (
                <div className="animate-in fade-in duration-300 space-y-10">
                    
                    {/* RESTAURAÇÃO: BLOCO QUEIXA PRINCIPAL DA IMAGEM */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
                          <Activity size={14} className="text-blue-600"/> Queixa Principal e Conduta Origem
                        </h4>
                        <p className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-[14px] text-slate-700 italic leading-relaxed font-medium normal-case">
                          "{caseData.clinico.justificativa}"
                        </p>
                    </div>

                    {/* RESTAURAÇÃO: BLOCOS DE DESTINO E ORIGEM DA IMAGEM */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 space-y-2 border rounded-2xl bg-blue-50/30 border-blue-100 shadow-sm">
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Especialidade Destino</p>
                            <p className="text-sm font-black text-slate-900">{caseData.clinico.especialidade}</p>
                        </div>
                        <div className="p-6 space-y-2 border border-slate-100 bg-slate-50/50 rounded-2xl shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nó de Origem</p>
                            <p className="text-sm font-black text-slate-900">{caseData.clinico.origem}</p>
                        </div>
                    </div>

                    {/* TABELA: INFORMAÇÃO DO PACIENTE */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                          <User size={14} className="text-blue-600"/> Dados Estruturados do Paciente
                      </h4>
                      <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-inner">
                          <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-100">
                                <tr className="grid grid-cols-4 md:grid-cols-6">
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Nome Titular</td>
                                  <td className="px-6 py-4 md:col-span-3 font-black text-slate-800 text-sm">{caseData.patient.nome}</td>
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">CPF / CNS</td>
                                  <td className="px-6 py-4 font-black text-slate-700 text-xs">{caseData.patient.cpf} / {caseData.patient.cns}</td>
                                </tr>
                                <tr className="grid grid-cols-4 md:grid-cols-6">
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Nascimento</td>
                                  <td className="px-6 py-4 font-black text-slate-700 text-xs">{caseData.patient.nascimento}</td>
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Idade</td>
                                  <td className="px-6 py-4 font-black text-slate-700 text-xs">{caseData.patient.idade} Anos</td>
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Território</td>
                                  <td className="px-6 py-4 font-black text-slate-700 text-xs">REGIONAL 01</td>
                                </tr>
                            </tbody>
                          </table>
                      </div>
                    </div>

                    {/* TABELA: DADOS CLÍNICOS */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                          <Activity size={14} className="text-blue-600"/> Resumo Técnico do Encaminhamento
                      </h4>
                      <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-inner">
                          <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-100">
                                <tr className="grid grid-cols-4">
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Especialidade</td>
                                  <td className="px-6 py-4 md:col-span-3 font-black text-blue-600 text-sm">{caseData.clinico.especialidade}</td>
                                </tr>
                                <tr className="grid grid-cols-4">
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Diagnóstico CID-10</td>
                                  <td className="px-6 py-4 md:col-span-3 font-black text-slate-900 text-xs">{caseData.clinico.cid10}</td>
                                </tr>
                                <tr className="grid grid-cols-4">
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Nó de Origem</td>
                                  <td className="px-6 py-4 font-black text-slate-700 text-xs">{caseData.clinico.origem}</td>
                                  <td className="px-6 py-4 bg-slate-50 font-bold text-[10px] text-slate-400">Solicitante</td>
                                  <td className="px-6 py-4 font-black text-slate-700 text-xs">{caseData.clinico.solicitante}</td>
                                </tr>
                            </tbody>
                          </table>
                      </div>
                    </div>
                </div>
              )}

              {activeTab === 'DOCS' && (
                <div className="animate-in fade-in space-y-8">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <FileText size={14} className="text-blue-600"/> Documentos Federados Vinculados
                      </h4>
                      <button onClick={() => navigate(`/provider/case/${id}/search`)} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                          Localizar na Rede <Globe size={14}/>
                      </button>
                    </div>
                    
                    {/* TABELA: DOCUMENTOS */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
                      <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400">
                                <th className="px-8 py-4 uppercase">Descrição do Documento</th>
                                <th className="px-8 py-4 uppercase">Nó Emissor</th>
                                <th className="px-8 py-4 uppercase">Data Emissão</th>
                                <th className="px-8 py-4 uppercase text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {docs.map((doc, idx) => (
                                <tr key={idx} className="group hover:bg-blue-50/10 transition-all">
                                  <td className="px-8 py-5">
                                      <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-300 group-hover:text-blue-600 transition-all shadow-sm"><FileText size={16}/></div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 leading-none mb-1">{doc.nome}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{doc.tipo}</p>
                                        </div>
                                      </div>
                                  </td>
                                  <td className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">{doc.node}</td>
                                  <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">{doc.data}</td>
                                  <td className="px-8 py-5 text-right">
                                      <button onClick={() => openDrawer('ClinicalDetailDrawer', { detail: doc.nome, hospital: doc.node, date: doc.data, hasOriginal: true })} className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                        <Eye size={18}/>
                                      </button>
                                  </td>
                                </tr>
                            ))}
                          </tbody>
                      </table>
                    </div>
                </div>
              )}

              {activeTab === 'GOV' && (
                <div className="animate-in fade-in p-8 border-2 border-blue-100 bg-blue-50/50 rounded-[2.5rem] space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-black text-blue-900 uppercase">
                      <ShieldCheck size={18}/> Governança de Acesso Ativa
                    </h4>
                    <p className="text-[11px] font-medium leading-relaxed text-blue-700 normal-case">
                      Sua instituição possui acesso autorizado ao dossiê clínico deste paciente para finalidade de TRATAMENTO. Todo acesso documental gera um carimbo de tempo no Ledger Nacional imutável.
                    </p>
                    <div className="pt-4 border-t border-blue-100 flex items-center justify-between font-mono text-[9px] text-blue-400">
                      <span>HASH AUDITORIA: 0xFD9421A882BC172635D91823F019283CAE28BE1</span>
                      <span className="flex items-center gap-1"><Database size={12}/> LEDGER SYNCED</span>
                    </div>
                </div>
              )}

              {activeTab === 'TIMELINE' && (
                <div className="animate-in fade-in space-y-8">
                    <div className="relative pl-8 space-y-10">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                      {[
                        { ev: 'PROTOCOL RECEIVED', actor: 'PROVIDER SYSTEM', time: 'HÁ 12 MIN', color: 'blue' },
                        { ev: 'REGULATION APPROVED', actor: 'CENTRAL REGULADORA', time: 'HÁ 45 MIN', color: 'emerald' },
                        { ev: 'CASE GENERATED', actor: 'UPA UNIDADE NORTE', time: 'HOJE, 09:15', color: 'slate' }
                      ].map((log, idx) => (
                          <div key={idx} className="relative group">
                            <div className={`absolute left-[-36px] top-0 w-4 h-4 rounded-full border-4 border-white transition-transform group-hover:scale-125 bg-blue-500 shadow-md`}></div>
                            <div className="p-6 transition-all border border-transparent bg-slate-50/50 rounded-2xl hover:border-slate-100">
                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1">{log.ev}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{log.actor} • {log.time}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                </div>
              )}
          </div>
      </section>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5"><Lock size={140} className="text-white"/></div>
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
               <Activity size={24} className="text-blue-400"/>
            </div>
            <div>
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Ambiente Seguro</p>
               <p className="text-sm font-bold text-slate-300 normal-case italic">"Cada acesso assistencial nesta tela é registrado de forma soberana para o paciente."</p>
            </div>
         </div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="text-right">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sincronismo Ledger</p>
               <p className="text-[11px] font-black text-emerald-400 uppercase">Verificado</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center">
               <CheckCircle size={16} className="text-emerald-400"/>
            </div>
         </div>
      </div>
    </div>
  );
};