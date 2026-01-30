
import React from 'react';
import { Pill, Clock, CheckCircle, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const PrescriptionsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
            <Pill size={14} /> Farmácia Federada
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Receitas Digitais</h1>
          <p className="text-slate-500 mt-1 text-lg">Acompanhe seus medicamentos e o status de dispensação.</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { med: 'Losartana Potássica 50mg', dose: '1 comprimido pela manhã', status: 'ATIVO', source: 'Dr. Ricardo - UBS Norte', expiry: 'Vence em 45 dias' },
          { med: 'Metformina 850mg', dose: '1 comprimido após o almoço', status: 'ATIVO', source: 'Dr. Ricardo - UBS Norte', expiry: 'Vence em 45 dias' },
          { med: 'Amoxicilina 500mg', dose: '8/8h por 7 dias', status: 'CONCLUÍDO', source: 'UPA Centro', expiry: 'Finalizado em Setembro' },
        ].map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-prominent transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Pill size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{p.med}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{p.dose}</p>
                <div className="flex items-center gap-2 mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="text-indigo-600">{p.source}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{p.expiry}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                {p.status}
              </span>
              <button className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                <ShoppingBag size={16}/> Retirar Medicamento
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
