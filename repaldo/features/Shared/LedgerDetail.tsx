
import React from 'react';
import { Shield, Hash, Clock, User, Building2, Code, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const LedgerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest">
        <ArrowLeft size={16} /> Voltar ao Explorer
      </button>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200">
              <Shield size={32} />
            </div>
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Integridade Verificada</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Evento de Auditoria #{id || 'TX-8421'}</h1>
          <p className="text-slate-500 font-mono text-sm mt-2">Hash: 0x8421a92bc8172635d91823f019283c</p>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Clock className="text-slate-300" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data e Hora</p>
                <p className="font-bold text-slate-700">14 de Outubro de 2024, 14:32:12</p>
              </div>
            </div>
            <div className="flex gap-4">
              <User className="text-slate-300" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ator do Acesso</p>
                <p className="font-bold text-slate-700">Dr. Ricardo Menezes (CRM-SP 123456)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Building2 className="text-slate-300" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição de Origem</p>
                <p className="font-bold text-slate-700">Hospital Regional Sul • Nó SP-01</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-blue-400 font-mono text-xs overflow-x-auto space-y-4 shadow-inner">
            <div className="flex items-center gap-2 text-slate-500 border-b border-slate-800 pb-2 mb-4">
              <Code size={14} /> <span>RAW DATA (JSON)</span>
            </div>
            <pre>
{`{
  "action": "READ_HISTORY",
  "patient_id": "P-421-923",
  "policy_id": "POL-842",
  "decision": "APPROVED",
  "mfa_validated": true,
  "ledger_node": "BR-CORE-04"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
