
import React, { useState } from 'react';
import { Lock, ShieldAlert, FileText, Send, User, Info, CheckCircle } from 'lucide-react';

export const RestrictedAccessRequestPage: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900">Acesso Restrito Federado</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Solicitando acesso a dados sensíveis (Psiquiatria, Genética, Oncologia). Este processo exige justificativa legal e gera auditoria prioritária.
        </p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl">
        <div className="flex border-b border-slate-100">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 p-6 text-center text-[10px] font-black uppercase tracking-widest transition-colors ${step === s ? 'text-amber-600 bg-amber-50' : 'text-slate-400'}`}>
              Passo 0{s}
            </div>
          ))}
        </div>

        <div className="p-12">
          {step === 1 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Justificativa Assistencial</h3>
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Motivo da Solicitação</label>
                <textarea 
                  className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-200 outline-none h-40 font-medium" 
                  placeholder="Descreva a necessidade clínica detalhada para acesso aos dados restritos..."
                />
              </div>
              <button onClick={() => setStep(2)} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl">Prosseguir</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Assinatura Digital</h3>
              <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 text-amber-900">
                 <Info size={24} className="shrink-0" />
                 <p className="text-sm font-medium leading-relaxed">
                   Ao assinar, você declara estar ciente de que este acesso será notificado ao paciente e ao DPO territorial do nó de origem.
                 </p>
              </div>
              <div className="space-y-4">
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Pin de Segurança</label>
                 <input type="password" placeholder="••••" className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-4xl font-mono tracking-[1em]" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-6 font-bold text-slate-400 uppercase text-xs tracking-widest">Voltar</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-6 bg-amber-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-200">Transmitir Solicitação</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 py-10">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900">Solicitação Enviada!</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                Seu pedido está sendo processado pelo motor de governança e pelo titular dos dados. Você será notificado do veredito.
              </p>
              <button className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Voltar à Bandeja</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
