
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, FileText, Eye, CheckCircle, Globe
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const ClinicalHistoryPage: React.FC = () => {
  const { openDrawer, openModal, addNotification } = useAppStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('ALL');

  const history = [
    { id: 'REC-001', date: '15/10/2024', type: 'CONSULTA', hospital: 'Hospital Regional Norte', doctor: 'Dr. Alberto Cruz', detail: 'Atendimento Especializado - Cardiologia', hasOriginal: true },
    { id: 'REC-002', date: '10/10/2024', type: 'EXAME', hospital: 'Lab Laboris Centro', doctor: 'Dra. Elena Santos', detail: 'Hemograma Completo', hasOriginal: true },
    { id: 'REC-003', date: '02/10/2024', type: 'PRESCRIÇÃO', hospital: 'UBS Jardim das Flores', doctor: 'Dr. Marcos Silva', detail: 'Renovação de Receita', hasOriginal: false },
  ];

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchSearch = item.detail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  const handleViewOriginal = (item: any) => {
      openModal('ConfirmationModal', {
        title: 'Acesso Auditado',
        message: 'Você está acessando um documento original assinado. Esta ação ficará registrada no ledger. Continuar?',
        type: 'info',
        onConfirm: () => {
           addNotification({ type: 'info', message: 'Abrindo documento...' });
           // Here you would trigger the document viewer
           openDrawer('ClinicalDetailDrawer', item);
        }
      });
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 font-sans">
      <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
         <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Histórico Clínico</h1>
            <p className="text-slate-500 text-xs font-medium mt-1">Sua trajetória assistencial unificada.</p>
         </div>
         {/* BOTÓN DE BUSCA TÉCNICA FEDERADA -> Meus Documentos */}
         <button 
             onClick={() => navigate('/patient/documents')}
             className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-bold text-xs uppercase tracking-wide shadow-lg transition-all flex items-center gap-2 active:scale-95"
           >
             <Globe size={14}/> 
             Meus Documentos
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 items-center bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
            <input 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="Buscar por diagnóstico, médico ou procedimento..." 
               className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-xs outline-none focus:border-blue-500"
            />
         </div>
         <select className="p-2 border border-slate-300 rounded text-xs font-bold text-slate-600 outline-none">
            <option value="ALL">Todo o Período</option>
            <option value="30D">Últimos 30 dias</option>
            <option value="1Y">Último Ano</option>
         </select>
         <select className="p-2 border border-slate-300 rounded text-xs font-bold text-slate-600 outline-none">
            <option value="ALL">Todos os Nós</option>
            <option value="HOSPITAL">Hospitais</option>
            <option value="UBS">UBS</option>
         </select>
      </div>

      {/* TABELA */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <tr>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Evento</th>
                  <th className="px-6 py-3">Especialidade / Detalhe</th>
                  <th className="px-6 py-3">Instituição</th>
                  <th className="px-6 py-3">Profissional</th>
                  <th className="px-6 py-3 text-right">Ação</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
               {filteredHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 font-mono text-slate-500">{item.date}</td>
                     <td className="px-6 py-3"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.type}</span></td>
                     <td className="px-6 py-3 font-bold text-slate-900">{item.detail}</td>
                     <td className="px-6 py-3 uppercase text-[10px]">{item.hospital}</td>
                     <td className="px-6 py-3 uppercase text-[10px]">{item.doctor}</td>
                     <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                              onClick={() => openDrawer('ClinicalDetailDrawer', item)}
                              className="text-blue-600 hover:underline font-bold uppercase text-[10px]"
                           >
                              Ver Detalhes
                           </button>
                           {item.hasOriginal && (
                              <button 
                                 onClick={() => handleViewOriginal(item)}
                                 className="text-emerald-600 hover:underline font-bold uppercase text-[10px] flex items-center gap-1"
                              >
                                 <CheckCircle size={10}/> Doc. Original
                              </button>
                           )}
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};
