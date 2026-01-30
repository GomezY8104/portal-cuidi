import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, Search, ChevronRight, ChevronDown, CheckSquare, Square, Building2, Zap, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MultiSelectDropdown = ({ 
  label, 
  options, 
  selected, 
  onToggle 
}: { 
  label: string, 
  options: string[], 
  selected: string[], 
  onToggle: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-wider ${
          selected.length > 0 ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm'
        }`}
      >
        {label} {selected.length > 0 && `(${selected.length})`}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 p-2 animate-in fade-in zoom-in-95 duration-200">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group text-left"
            >
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-slate-900">{opt}</span>
              {selected.includes(opt) ? <CheckSquare size={16} className="text-blue-600" /> : <Square size={16} className="text-slate-200" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const RegulationQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const queue = [
    { id: 'UPA-901', priority: 'ALTA', name: 'MANOEL GOMES DA SILVA', spec: 'CARDIOLOGIA', origin: 'UPA CENTRO', time: '42 MIN', sla: 'CRÍTICO' },
    { id: 'ENC-202', priority: 'MÉDIA', name: 'MARIA APARECIDA SOUZA', spec: 'OFTALMOLOGIA', origin: 'UBS SUL', time: '1H 20M', sla: 'NORMAL' },
  ];

  const handleTogglePriority = (val: string) => setSelectedPriorities(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight leading-none">Fila de Encaminhamento</h1>
          <p className="text-slate-400 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] flex items-center gap-2">
            <Building2 size={12} className="text-blue-500"/> Sistema Nacional de Regulação Federada
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <MultiSelectDropdown label="Prioridade" options={['ALTA', 'MÉDIA', 'BAIXA']} selected={selectedPriorities} onToggle={handleTogglePriority} />
          
          <div className="relative flex-1 lg:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              placeholder="Paciente ou Protocolo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-prominent">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[140px]">Prioridade</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[300px]">Paciente / Protocolo</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Especialidade</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[180px]">Origem</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[120px]">SLA</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right w-[110px]">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase ${
                      item.priority === 'ALTA' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                    }`}>{item.priority}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[12px] font-bold text-slate-900 uppercase leading-none mb-1">{item.name}</p>
                    <p className="font-mono text-[10px] font-bold text-blue-600 tracking-tight">#{item.id}</p>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-semibold text-slate-600 uppercase tracking-tight">{item.spec}</td>
                  <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.origin}</td>
                  <td className="px-8 py-6 text-[11px] font-bold text-red-600 tabular-nums">{item.time}</td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => navigate(`/regulator/case/${item.id}`)} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md"><Zap size={16} fill="currentColor"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};