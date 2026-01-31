
import React, { useState, useMemo } from 'react';
import { FileText, Download, Eye, Filter, Share2, Globe, Building2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const ExamResultsPage: React.FC = () => {
  const { openModal } = useAppStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterNode, setFilterNode] = useState('ALL'); // NUEVO FILTRO DE NODO

  const exams = [
    { id: 'EX-991', title: 'Raio-X de Tórax', lab: 'Hospital Central', date: '12/10/2024', status: 'Disponível', type: 'IMAGEM' },
    { id: 'EX-992', title: 'Hemograma Completo', lab: 'Lab Exames S/A', date: '10/10/2024', status: 'Disponível', type: 'LAB' },
    { id: 'EX-993', title: 'Ecocardiograma', lab: 'Cardio Centro', date: '05/10/2024', status: 'Processando', type: 'IMAGEM' },
  ];

  const filtered = useMemo(() => {
    return exams.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'ALL' || e.type === filterType;
        const matchNode = filterNode === 'ALL' || e.lab === filterNode; // FILTRADO POR NODO
        return matchSearch && matchType && matchNode;
    });
  }, [searchTerm, filterType, filterNode]);

  const handleShare = (exam: any) => {
      openModal('NewConsentModal', { specificExam: exam.id }); // Reusing consent modal logic
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 font-sans">
      <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
         <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Exames</h1>
            <p className="text-slate-500 text-xs font-medium mt-1">Acesso aos seus laudos e imagens federadas.</p>
         </div>
         {/* BOTÓN DE BUSCA TÉCNICA FEDERADA -> Meus Documentos */}
         <button 
             onClick={() => navigate('/patient/documents')}
             className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-xs uppercase tracking-wide shadow-lg transition-all flex items-center gap-2 active:scale-95"
           >
             <Globe size={14}/> 
             Meus Documentos
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
         <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Filtrar exames..." 
            className="flex-1 p-2 border border-slate-300 rounded text-xs outline-none focus:border-blue-500"
         />
         {/* FILTRO DE NODO / INSTITUIÇÃO */}
         <select 
            value={filterNode}
            onChange={e => setFilterNode(e.target.value)}
            className="p-2 border border-slate-300 rounded text-xs font-bold text-slate-600 outline-none"
         >
            <option value="ALL">Todas as Instituições</option>
            {Array.from(new Set(exams.map(e => e.lab))).map(lab => <option key={lab} value={lab}>{lab}</option>)}
         </select>
         <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="p-2 border border-slate-300 rounded text-xs font-bold text-slate-600 outline-none"
         >
            <option value="ALL">Todos os Tipos</option>
            <option value="LAB">Laboratorial</option>
            <option value="IMAGEM">Imagem</option>
         </select>
         <select className="p-2 border border-slate-300 rounded text-xs font-bold text-slate-600 outline-none">
            <option value="ALL">Qualquer Data</option>
            <option value="30D">30 Dias</option>
         </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <tr>
                  <th className="px-6 py-3">Nome do Exame</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Origem</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Ação</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
               {filtered.map(exam => (
                  <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 font-bold text-slate-900">{exam.title}</td>
                     <td className="px-6 py-3 uppercase text-[10px]">{exam.type}</td>
                     <td className="px-6 py-3 font-mono text-slate-500">{exam.date}</td>
                     <td className="px-6 py-3 uppercase text-[10px] flex items-center gap-1.5"><Building2 size={10} className="text-slate-400"/> {exam.lab}</td>
                     <td className="px-6 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${exam.status === 'Disponível' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {exam.status}
                        </span>
                     </td>
                     <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                           <button 
                              onClick={() => openModal('ExamViewModal', exam)}
                              disabled={exam.status !== 'Disponível'}
                              className="text-slate-500 hover:text-blue-600 disabled:opacity-50" title="Ver Laudo"
                           >
                              <Eye size={16}/>
                           </button>
                           <button 
                              className="text-slate-500 hover:text-slate-900 disabled:opacity-50" title="Baixar PDF"
                              disabled={exam.status !== 'Disponível'}
                           >
                              <Download size={16}/>
                           </button>
                           <button 
                              onClick={() => handleShare(exam)}
                              className="text-slate-500 hover:text-indigo-600" title="Compartilhar"
                           >
                              <Share2 size={16}/>
                           </button>
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
