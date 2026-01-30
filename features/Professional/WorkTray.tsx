import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Search, Activity, ChevronRight, X, ChevronDown, CheckSquare, Square
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

export const WorkTrayPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const cases = [
    { id: 'ENC-202', patient: 'MARIA APARECIDA DA SILVA', specialty: 'CARDIOLOGIA', status: 'PENDENTE', date: 'HOJE, 09:00', risk: 'AMARELO' },
    { id: 'ENC-203', patient: 'JOÃO CARLOS PEREIRA', specialty: 'ORTOPEDIA', status: 'ENVIADO', date: 'ONTEM', risk: 'VERDE' },
    { id: 'ENC-204', patient: 'ANA JULIA FONTES', specialty: 'NEUROLOGIA', status: 'QUALIFICADO', date: '12 OUT 2024', risk: 'VERMELHO' },
  ];

  const handleToggleRisk = (val: string) => setSelectedRisks(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  const handleToggleStatus = (val: string) => setSelectedStatus(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">Fila de Encaminhamento APS</h1>
          <p className="text-slate-400 text-[10px] font-bold mt-4 uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity size={12} className="text-blue-500"/> Monitoramento Territorial • Nó: UBS Jardim das Flores
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <MultiSelectDropdown label="Urgência" options={['VERMELHO', 'AMARELO', 'VERDE']} selected={selectedRisks} onToggle={handleToggleRisk} />
            <MultiSelectDropdown label="Fluxo" options={['PENDENTE', 'ENVIADO', 'QUALIFICADO']} selected={selectedStatus} onToggle={handleToggleStatus} />
          </div>

          <div className="relative flex-1 lg:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              placeholder="Pesquisar paciente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => navigate('/aps/new-case')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} /> Novo Protocolo
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-prominent">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[140px]">Protocolo</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[300px]">Paciente</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Especialidade</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-[120px]">Prioridade</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[150px]">Data</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[140px]">Estado</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right w-[110px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cases.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-6 font-mono font-bold text-blue-600 text-xs tracking-tight">#{item.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-[10px] text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">{item.patient.charAt(0)}</div>
                      <span className="text-[12px] font-bold text-slate-900 uppercase tracking-tight leading-none">{item.patient}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-semibold text-[11px] text-slate-600 uppercase tracking-tight">{item.specialty}</td>
                  <td className="px-8 py-6 text-center">
                    <div className={`w-3 h-3 rounded-full mx-auto shadow-sm border-2 border-white ring-1 ring-slate-100 ${
                      item.risk === 'VERMELHO' ? 'bg-red-600 animate-pulse' : item.risk === 'AMARELO' ? 'bg-yellow-400' : 'bg-green-500'
                    }`}></div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</td>
                  <td className="px-8 py-6">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-bold uppercase border border-slate-200">{item.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => navigate(`/aps/case/${item.id}`)} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-90"><ChevronRight size={16}/></button>
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