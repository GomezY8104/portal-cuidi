
import React from 'react';
import { Bell, Shield, Lock, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const NotificationsCenterPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notificações</h1>
          <p className="text-slate-500 text-lg">Histórico completo de interações e alertas da sua conta.</p>
        </div>
        <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Marcar todas como lidas</button>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Acesso Federado Autorizado', desc: 'Seu histórico clínico foi acessado pelo Hospital Regional Sul para finalidade de tratamento.', icon: <Lock className="text-blue-600"/>, time: 'Hoje, 14:32', type: 'SECURITY' },
          { title: 'Novo Exame Disponível', desc: 'O laudo de Raio-X de Tórax foi publicado pelo Nó Central.', icon: <Activity className="text-emerald-600"/>, time: 'Ontem, 09:15', type: 'HEALTH' },
          { title: 'Atualização de Política', desc: 'Uma nova política de governança foi aplicada ao seu nó institucional.', icon: <Shield className="text-indigo-600"/>, time: '12 Out 2024', type: 'SYSTEM' },
          { title: 'Alerta de Segurança', desc: 'Tentativa de login bloqueada a partir de um novo dispositivo.', icon: <AlertTriangle className="text-red-600"/>, time: '10 Out 2024', type: 'ALERT' },
        ].map((n, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex gap-6 hover:shadow-prominent transition-all cursor-pointer">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
              {n.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{n.title}</h3>
                <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase"><Clock size={10}/> {n.time}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
