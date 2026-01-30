
import React, { useState, useMemo } from 'react';
import { 
  Activity, Calendar, MapPin, ChevronRight, 
  Stethoscope, FileText, Pill, Search, Filter,
  Building2, Globe, Clock, FileDown, Download
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ClinicalHistoryPage: React.FC = () => {
  const openDrawer = useAppStore(s => s.openDrawer);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState('ALL');

  const history = [
    { id: 'REC-001', date: '15 Out 2024', type: 'CONSULTA', hospital: 'Hospital Regional Norte', doctor: 'Dr. Alberto Cruz', detail: 'Atendimento Especializado - Cardiologia', icon: <Stethoscope size={20}/>, color: 'blue', hasOriginal: true },
    { id: 'REC-002', date: '10 Out 2024', type: 'EXAME', hospital: 'Lab Laboris Centro', doctor: 'Dra. Elena Santos', detail: 'Hemograma Completo e Glicada', icon: <FileText size={20}/>, color: 'emerald', hasOriginal: true },
    { id: 'REC-003', date: '02 Out 2024', type: 'PRESCRIÇÃO', hospital: 'UBS Jardim das Flores', doctor: 'Dr. Marcos Silva', detail: 'Renovação de Receita - Uso Contínuo', icon: <Pill size={20}/>, color: 'indigo', hasOriginal: false },
    { id: 'REC-004', date: '28 Set 2024', type: 'CONSULTA', hospital: 'Hospital das Clínicas', doctor: 'Dr. Fabio Lima', detail: 'Avaliação Ortopédica', icon: <Stethoscope size={20}/>, color: 'blue', hasOriginal: true },
  ];

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchSearch = item.detail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchNode = selectedNode === 'ALL' || item.hospital === selectedNode;
      return matchSearch && matchNode;
    });
  }, [searchTerm, selectedNode]);

  const recentRecords = history.slice(0, 2);

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Activity size={14} /> Jornada Federada do Paciente
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Meu Histórico Clínico</h1>
          <p className="text-slate-500 mt-1 text-lg font-medium">Sua trajetória assistencial unificada em todos os nós da rede.</p>
        </div>
      </div>

      {/* Destaques Recentes */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Últimos Registros Emitidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentRecords.map((rec) => (
            <div key={rec.id} onClick={() => openDrawer('ClinicalDetailDrawer', rec)} className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-sm flex items-center gap-5 cursor-pointer hover:border-blue-500 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-${rec.color}-50 text-${rec.color}-600 flex items-center justify-center shrink-0`}>
                {rec.icon}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{rec.date}</p>
                <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{rec.detail}</p>
                <p className="text-[10px] text-slate-500 font-medium">{rec.hospital}</p>
              </div>
              <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600 transition-all" />
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
            placeholder="Buscar por diagnóstico, médico ou procedimento..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium text-sm focus:border-blue-200 transition-all" 
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={selectedNode}
              onChange={e => setSelectedNode(e.target.value)}
              className="w-full pl-12 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs uppercase tracking-widest appearance-none"
            >
              <option value="ALL">Todos os Nós</option>
              <option value="Hospital Regional Norte">Regional Norte</option>
              <option value="Lab Laboris Centro">Lab Laboris</option>
              <option value="UBS Jardim das Flores">UBS Jardim Flores</option>
              <option value="Hospital das Clínicas">Hosp. Clínicas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
        <div className="space-y-12">
          {filteredHistory.map((item, i) => (
            <div key={i} className="relative flex items-start gap-12 group animate-in slide-in-from-left duration-500" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`z-10 w-16 h-16 rounded-2xl bg-white border-4 border-slate-50 flex items-center justify-center text-${item.color}-600 shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              
              <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-prominent transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{item.detail}</h3>
                  </div>
                  <span className={`px-4 py-1 bg-slate-50 text-${item.color}-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100`}>
                    {item.type}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-2"><MapPin size={14}/> {item.hospital}</div>
                  <div className="flex items-center gap-2"><Building2 size={14}/> {item.doctor}</div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {item.hasOriginal && (
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <FileDown size={14}/> Doc Original Disponível
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => openDrawer('ClinicalDetailDrawer', item)}
                    className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    Ver Detalhes <ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
