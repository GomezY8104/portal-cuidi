import { PageHeader } from 'react-native-paper';
import { Mail, MessageSquare } from 'react-native-vector-icons';
import { useState } from 'react';

const ContactPage = () => {
  const [text, setText] = useState('');

  return (
    <>
      <PageHeader title="Contato & Suporte" subtitle="Governança Federada e Suporte Institucional" icon={MessageSquare} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-blue-600 p-10 rounded-[3rem] text-white space-y-8">
          <h3 className="text-2xl font-black">Canais Oficiais</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Mail className="text-blue-200"/>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">E-mail Institucional</p>
                <p className="font-bold">suporte@cuidi.saude.gov.br</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageSquare className="text-blue-200"/>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Governança Federada</p>
                <p className="font-bold">0800 123 4567</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <input placeholder="Seu E-mail" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
            <textarea placeholder="Sua Mensagem" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none h-32" />
            <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Enviar Mensagem</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;