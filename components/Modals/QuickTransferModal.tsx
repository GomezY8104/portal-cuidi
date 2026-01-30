import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, CheckCircle, MapPin, Search, ChevronDown, CheckSquare, Square, Building2 } from 'lucide-react';
import { ICDSelectionRow } from '../Inputs/ICDSelectionRow';

interface QuickTransferModalProps {
  patient: any;
  onClose: () => void;
  onConfirm: () => void;
}

export const QuickTransferModal: React.FC<QuickTransferModalProps> = ({ patient, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  
  // Estado del formulario actualizado para soportar array de proveedores
  const [formData, setFormData] = useState({
    specialty: 'Cardiologia',
    diagnosisCode: '',
    diagnosisDesc: '',
    urgency: 'Urgente',
    notes: '',
    selectedProviders: [] as string[] // Array de IDs
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const providers = [
    { id: 'p1', name: 'Hospital Universitário', type: 'Hospital', dist: '2 km', spec: 'Cardiologia' },
    { id: 'p2', name: 'Clínica Cardio Plus', type: 'Clínica', dist: '5 km', spec: 'Cardiologia' },
    { id: 'p3', name: 'Instituto de Cardiologia', type: 'Especializado', dist: '8 km', spec: 'Cardiologia' },
    { id: 'p4', name: 'Santa Casa Regional', type: 'Hospital', dist: '12 km', spec: 'Cardiologia' },
  ];

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNext = () => {
    if (step === 3 && formData.selectedProviders.length === 0) {
      alert('Por favor, selecione ao menos uma unidade de destino.');
      return;
    }
    if (step < 3) setStep(step + 1);
    else onConfirm();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateDiagnosis = (code: string, desc: string) => {
    setFormData(prev => ({ ...prev, diagnosisCode: code, diagnosisDesc: desc }));
  };

  // Lógica de Multiselección
  const toggleProvider = (id: string) => {
    setFormData(prev => {
      const exists = prev.selectedProviders.includes(id);
      return {
        ...prev,
        selectedProviders: exists 
          ? prev.selectedProviders.filter(p => p !== id)
          : [...prev.selectedProviders, id]
      };
    });
  };

  const toggleAllProviders = () => {
    const allSelected = formData.selectedProviders.length === providers.length;
    setFormData(prev => ({
      ...prev,
      selectedProviders: allSelected ? [] : providers.map(p => p.id)
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Encaminhamento Rápido</h2>
              <p className="text-xs text-slate-500 font-medium">Paciente: {patient.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mb-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
            ))}
          </div>
        </div>

        <div className="p-6 pt-2 flex-1 overflow-y-auto custom-scrollbar">
          {/* STEP 1: INFORMACIÓN DEL PACIENTE (READ ONLY) */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <h3 className="text-sm font-black text-slate-900">Etapa 1: Informações do Paciente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nome</label>
                  <input readOnly value={patient.name} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">CPF</label>
                  <input readOnly value={patient.cpf} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Idade</label>
                  <input readOnly value="58 anos" className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Telefone</label>
                  <input readOnly value={patient.phone} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DADOS CLÍNICOS */}
          {step === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right duration-300">
              <h3 className="text-sm font-black text-slate-900">Etapa 2: Dados Clínicos</h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Especialidade</label>
                <input 
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Diagnóstico (CID)</label>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                   <ICDSelectionRow 
                      label=""
                      selectedCode={formData.diagnosisCode}
                      selectedDescription={formData.diagnosisDesc}
                      onUpdate={updateDiagnosis}
                   />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Urgência</label>
                <select 
                  value={formData.urgency}
                  onChange={e => setFormData({...formData, urgency: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                >
                  <option>Urgente</option>
                  <option>Muito Urgente</option>
                  <option>Emergência</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Observações</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Adicione observações clínicas adicionais..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-blue-500 h-24 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SELEÇÃO DE PRESTADOR MULTIPLE */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Etapa 3: Seleção de Prestador</h3>
                <p className="text-[10px] text-slate-500">Selecione uma ou mais unidades de destino.</p>
              </div>
              
              <div className="space-y-3" ref={dropdownRef}>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Unidades Disponíveis</label>
                
                {/* Dropdown Trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-left flex justify-between items-center outline-none focus:border-blue-500 hover:border-blue-300 transition-all shadow-sm"
                  >
                    <span className="text-xs font-bold text-slate-700">
                      {formData.selectedProviders.length > 0 
                        ? `${formData.selectedProviders.length} Unidade(s) Selecionada(s)` 
                        : 'Selecione os prestadores...'}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Content */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      
                      {/* Select All Option */}
                      <button 
                        onClick={toggleAllProviders}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                      >
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                          {formData.selectedProviders.length === providers.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                        </span>
                        {formData.selectedProviders.length === providers.length 
                          ? <CheckSquare size={16} className="text-blue-600" />
                          : <Square size={16} className="text-slate-300" />
                        }
                      </button>

                      <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
                        {providers.map(prov => (
                          <button
                            key={prov.id}
                            onClick={() => toggleProvider(prov.id)}
                            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left group"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{prov.name}</span>
                              <span className="text-[9px] font-medium text-slate-400">{prov.type} • {prov.dist}</span>
                            </div>
                            {formData.selectedProviders.includes(prov.id) 
                              ? <CheckSquare size={18} className="text-blue-600 shrink-0" /> 
                              : <Square size={18} className="text-slate-200 shrink-0" />
                            }
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Chips */}
                {formData.selectedProviders.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    {formData.selectedProviders.map(id => {
                      const p = providers.find(prov => prov.id === id);
                      return p ? (
                        <div key={id} className="flex items-center gap-1.5 bg-white border border-slate-200 pl-3 pr-2 py-1.5 rounded-lg shadow-sm animate-in zoom-in duration-200">
                          <Building2 size={12} className="text-slate-400"/>
                          <span className="text-[10px] font-bold text-slate-700">{p.name}</span>
                          <button onClick={() => toggleProvider(id)} className="ml-1 p-0.5 hover:bg-red-50 hover:text-red-500 rounded text-slate-400 transition-colors">
                            <X size={12} />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 pt-4 border-t border-slate-100 flex gap-4">
          <button 
            onClick={step === 1 ? onClose : handleBack}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-wide"
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          <button 
            onClick={handleNext}
            disabled={step === 3 && formData.selectedProviders.length === 0}
            className={`flex-1 py-3 rounded-xl text-xs font-bold text-white uppercase tracking-wide transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${step === 3 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'} ${step === 3 && formData.selectedProviders.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {step === 3 ? <><CheckCircle size={16}/> Confirmar ({formData.selectedProviders.length})</> : 'Próximo'}
          </button>
        </div>

      </div>
    </div>
  );
};