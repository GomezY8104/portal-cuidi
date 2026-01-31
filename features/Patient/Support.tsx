
import React from 'react';
import { MessageSquare, ChevronRight, HelpCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PatientSupportPage: React.FC = () => {
  const { openModal } = useAppStore();

  const faqs = [
    { q: 'Como revogar um consentimento?', cat: 'Privacidade' },
    { q: 'Meus exames não aparecem na lista', cat: 'Dados' },
    { q: 'Como agendar uma consulta?', cat: 'Agendamento' },
    { q: 'Esqueci minha senha', cat: 'Acesso' },
  ];

  const handleContact = () => {
      openModal('JustificationModal', { text: '', onSave: (msg: string) => alert('Mensagem enviada: ' + msg) }); 
      // Using JustificationModal as a generic text input modal for demo
  };

  const handleViewFaq = (faq: any) => {
      alert(`Resposta para: "${faq.q}"\n\n(Conteúdo do artigo de ajuda...)`);
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20 font-sans">
      <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
         <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Suporte ao Cidadão</h1>
            <p className="text-slate-500 text-xs font-medium mt-1">Canal de ajuda e tira-dúvidas.</p>
         </div>
         <button 
            onClick={handleContact}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 shadow-sm active:scale-95"
         >
            <MessageSquare size={14}/> Entrar em Contato
         </button>
      </div>

      <section className="space-y-4">
         <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2"><HelpCircle size={16} className="text-blue-600"/> Perguntas Frequentes</h3>
         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-6 py-3">Pergunta</th>
                     <th className="px-6 py-3">Categoria</th>
                     <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {faqs.map((f, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleViewFaq(f)}>
                        <td className="px-6 py-4 font-bold text-slate-900">{f.q}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase text-slate-500">{f.cat}</span></td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-blue-600 hover:underline font-bold uppercase text-[10px] flex items-center gap-1 ml-auto">
                              Ver Resposta <ChevronRight size={12}/>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
};
