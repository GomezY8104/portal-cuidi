
import React from 'react';
import { AlertCircle, Droplet, Heart, Shield, QrCode, ArrowRight } from 'lucide-react';

export const EmergencyProfilePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="bg-red-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><AlertCircle size={200} /></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/40">
            <Heart size={48} fill="white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-none">Perfil de Emergência</h1>
          <p className="text-red-100 font-medium">Dados vitais para equipes de socorro imediato.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center">
          <Droplet className="mx-auto mb-4 text-red-600" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo Sanguíneo</p>
          <p className="text-3xl font-black text-slate-900">O+</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center">
          <AlertCircle className="mx-auto mb-4 text-amber-600" size={32} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alergias</p>
          <p className="text-xl font-black text-slate-900">Dipirona, Pólen</p>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col items-center text-center space-y-6">
        <div className="bg-white p-4 rounded-3xl">
          <QrCode size={120} className="text-slate-900" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Acesso via QR Code</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Em caso de emergência, socorristas autenticados podem ler este código para acessar seus dados vitais instantaneamente.</p>
        </div>
        <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Imprimir Cartão de Emergência</button>
      </div>
    </div>
  );
};
