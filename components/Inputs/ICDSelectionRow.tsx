import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, BookOpen, Hash, AlertCircle } from 'lucide-react';
import { MOCK_ICD_DB, ICDEntry } from '../../mocks/icd_seed';

interface ICDSelectionRowProps {
  label: string;
  selectedCode: string;
  selectedDescription: string;
  onUpdate: (code: string, description: string) => void;
  required?: boolean;
}

export const ICDSelectionRow: React.FC<ICDSelectionRowProps> = ({ 
  label, 
  selectedCode, 
  selectedDescription,
  onUpdate,
  required = false
}) => {
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(false);
  
  const codeRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (codeRef.current && !codeRef.current.contains(event.target as Node)) setIsCodeOpen(false);
      if (descRef.current && !descRef.current.contains(event.target as Node)) setIsDescOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrado para Código
  const filteredByCode = useMemo(() => {
    if (selectedCode.length < 1) return [];
    return MOCK_ICD_DB.filter(item => item.code.toLowerCase().startsWith(selectedCode.toLowerCase())).slice(0, 5);
  }, [selectedCode]);

  // Filtrado para Descripción
  const filteredByDesc = useMemo(() => {
    if (selectedDescription.length < 2) return [];
    return MOCK_ICD_DB.filter(item => 
      item.description.toLowerCase().includes(selectedDescription.toLowerCase()) ||
      item.code.toLowerCase().includes(selectedDescription.toLowerCase())
    ).slice(0, 5);
  }, [selectedDescription]);

  // Al seleccionar, actualizamos ambos campos
  const handleSelect = (item: ICDEntry) => {
    onUpdate(item.code, item.description);
    setIsCodeOpen(false);
    setIsDescOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* CAMPO A: CÓDIGO CID */}
        <div className="relative w-full md:w-32" ref={codeRef}>
          <div className="relative group">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={16} />
            <input 
              type="text"
              value={selectedCode}
              onChange={(e) => {
                onUpdate(e.target.value.toUpperCase(), selectedDescription); // Permite escribir libremente sin borrar la descripción
                setIsCodeOpen(true);
              }}
              onFocus={() => setIsCodeOpen(true)}
              placeholder="CID"
              className="w-full pl-9 pr-3 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-black text-slate-700 transition-all text-sm uppercase shadow-sm"
              maxLength={6}
            />
          </div>
          
          {/* Dropdown Código */}
          {isCodeOpen && filteredByCode.length > 0 && (
            <div className="absolute top-full left-0 w-[300px] mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
               {filteredByCode.map(item => (
                 <button key={item.code} onClick={() => handleSelect(item)} className="w-full text-left p-3 hover:bg-blue-50 border-b border-slate-50 flex items-center gap-2">
                    <span className="font-black text-blue-600 text-xs w-16">{item.code}</span>
                    <span className="text-xs text-slate-600 truncate">{item.description}</span>
                 </button>
               ))}
            </div>
          )}
        </div>

        {/* CAMPO B: DESCRIÇÃO DA DOENÇA */}
        <div className="relative flex-1" ref={descRef}>
          <div className="relative group">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={18} />
            <input 
              type="text"
              value={selectedDescription}
              onChange={(e) => {
                onUpdate(selectedCode, e.target.value); // Permite escribir libremente sin borrar el código
                setIsDescOpen(true);
              }}
              onFocus={() => setIsDescOpen(true)}
              placeholder="Descrição da doença ou agravo..."
              className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium text-slate-700 transition-all text-sm shadow-sm"
            />
            {(selectedCode || selectedDescription) && (
              <button 
                onClick={() => onUpdate('', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown Descrição */}
          {isDescOpen && filteredByDesc.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar">
               {filteredByDesc.map(item => (
                 <button key={item.code} onClick={() => handleSelect(item)} className="w-full text-left p-3 hover:bg-blue-50 border-b border-slate-50 flex flex-col">
                    <div className="flex justify-between items-center w-full">
                       <span className="text-xs font-bold text-slate-700">{item.description}</span>
                       <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{item.code}</span>
                    </div>
                 </button>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};