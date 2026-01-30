
import React, { useState, useMemo } from 'react';
import { FileText, Download, Eye, Calendar, Building2, Search, Filter, Globe, Activity, FileDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ExamResultsPage: React.FC = () => {
  const openModal = useAppStore(s => s.openModal);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState('ALL');

  const exams = [
    { id: 'EX-991', title: 'Raio-X de Tórax', lab: 'Hospital Central', date: '12 Out 2024', status: 'Disponível', type: 'IMAGEM', hasOriginal: true },
    { id: 'EX-992', title: 'Hemograma Completo', lab: 'Lab Exames S/A', date: '10 Out 2024', status: 'Disponível', type: 'LAB', hasOriginal: true },
    { id: 'EX-993', title: 'Ecocardiograma', lab: 'Cardio Centro', date: '05 Out 2024', status: 'Processando', type: 'IMAGEM', hasOriginal: false },
    { id: 'EX-994', title: 'Glicemia de Jejum', lab: 'Hospital das Clínicas', date: '02 Out 2024', status: 'Disponível', type: 'LAB', hasOriginal: true },
  ];

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchNode = selectedNode === 'ALL' || exam.lab === selectedNode;
      return matchSearch && matchNode;
    });
  }, [searchTerm, selectedNode]);

  const recentExams = exams.slice(0, 3);

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Activity size={14} /> Meus Laudos Digitais
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Resultados de Exames</h1>
          <p className="text-slate-500 mt-1 text-lg font-medium">Acesse resultados laboratoriais e de imagem de toda a rede federada.</p>
        </div>
      </div>

      {/* Lançamentos Recentes */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Lançamentos Recentes na Rede</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentExams.map((exam) => (
            <div key={exam.id} className="bg-white p-6 rounded-[2rem] border-2 border-emerald-50 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute top-2 right-2 p-1.5 bg-emerald-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                 <CheckCircle2 size={12}/>
               </div>
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={24}/>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{exam.date}</p>
               <h4 className="font-bold text-slate-900 text-sm leading-tight">{exam.title}</h4>
               <p className="text-[9px] text-slate-500 font-bold uppercase mt-2 tracking-widest">{exam.lab}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Busca e Filtros */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            type="text" 
            placeholder="Pesquisar por nome do exame ou tipo..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium text-sm focus:border-emerald-200 transition-all" 
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={selectedNode}
              onChange={e => setSelectedNode(e.target.value)}
              className="w-full pl-12 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs uppercase tracking-widest appearance-none min-w-[200px]"
            >
              <option value="ALL">Todos os Nós Federados</option>
              <option value="Hospital Central">Hospital Central</option>
              <option value="Lab Exames S/A">Lab Exames S/A</option>
              <option value="Cardio Centro">Cardio Centro</option>
              <option value="Hospital das Clínicas">Hosp. Clínicas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-prominent transition-all group animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <FileText size={24} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${exam.status === 'Disponível' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {exam.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{exam.title}</h3>
            <div className="space-y-3 mb-8">
              <p className="text-xs font-medium text-slate-500 flex items-center gap-2"><Building2 size={14}/> {exam.lab}</p>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-2"><Calendar size={14}/> {exam.date}</p>
              {exam.hasOriginal && (
                <p className="text-[9px] font-black text-emerald-600 flex items-center gap-1.5 uppercase tracking-tighter"><FileDown size={14}/> PDF Original disponível</p>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
               <button 
                  disabled={exam.status !== 'Disponível'}
                  onClick={() => openModal('ExamViewModal', exam)}
                  className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${exam.status === 'Disponível' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                >
                  <Eye size={18}/> Ver Laudo Digital
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckCircle2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
