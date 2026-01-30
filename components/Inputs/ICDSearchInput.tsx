
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, AlertCircle, BookOpen } from 'lucide-react';
import { MOCK_ICD_DB, ICDEntry } from '../../mocks/icd_seed';

interface ICDSearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ICDSearchInput: React.FC<ICDSearchInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Digite o código ou nome da doença...",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sincronizar valor externo se mudar
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (inputValue.length < 2) return [];
    const lowerTerm = inputValue.toLowerCase();
    return MOCK_ICD_DB.filter(item => 
      item.code.toLowerCase().includes(lowerTerm) || 
      item.description.toLowerCase().includes(lowerTerm)
    ).slice(0, 8); // Limitar a 8 sugestões
  }, [inputValue]);

  const handleSelect = (item: ICDEntry) => {
    const formatted = `${item.code} - ${item.description}`;
    setInputValue(formatted);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange(newVal); // Permite entrada livre
    setIsOpen(true);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative group">
        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
        
        <input 
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium transition-all shadow-sm focus:shadow-md text-sm"
        />
        
        {inputValue && (
          <button 
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown de Sugestões */}
      {isOpen && inputValue.length >= 2 && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sugestões CID-10/11</span>
              <span className="text-[9px] font-bold text-blue-600 uppercase">Biblioteca Oficial</span>
           </div>
           <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
              {filteredOptions.map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-4 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition-colors group"
                >
                   <div className="flex items-start gap-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-black font-mono group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {item.code}
                      </span>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-900 leading-snug">
                        {item.description}
                      </span>
                   </div>
                </button>
              ))}
           </div>
        </div>
      )}
      
      {isOpen && inputValue.length >= 2 && filteredOptions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-center">
           <div className="flex flex-col items-center gap-2 text-slate-400">
              <AlertCircle size={20} />
              <span className="text-xs font-medium">Nenhum código encontrado na base.</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Você pode manter o texto livre.</span>
           </div>
        </div>
      )}
    </div>
  );
};
