import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, Save, Globe, Shield, FileText, Server, Map } from 'lucide-react';

export const SystemAdminModals: React.FC = () => {
  const { activeModal, closeModal } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Operación realizada con éxito en el Ledger de Gobernanza.');
      closeModal();
    }, 1000);
  };

  // Render content based on modal type
  const renderContent = () => {
    switch (activeModal) {
      case 'RegisterNodeModal':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nombre Técnico (CNES/ID)</label>
                <input className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold" placeholder="BR-SP-HOSP-001" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tipo de Nodo</label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                    <option>HOSPITAL</option>
                    <option>APS/UBS</option>
                    <option>LABORATORIO</option>
                    <option>SECRETARIA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Región</label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                    <option>SÃO PAULO (SP)</option>
                    <option>RIO DE JANEIRO (RJ)</option>
                    <option>MINAS GERAIS (MG)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Endpoint Base (API)</label>
                <input className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono" placeholder="https://api.node.gov.br/v1" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Certificado Digital (Mock)</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-400">
                  -----BEGIN CERTIFICATE----- ...
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs uppercase rounded-lg hover:bg-slate-800 flex items-center gap-2">
                {loading ? 'Procesando...' : <><Server size={14}/> Registrar Nodo</>}
              </button>
            </div>
          </>
        );

      case 'CreateTerritoryModal':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nombre del Territorio</label>
                <input className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold" placeholder="Regional Metropolitana 1" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">UF / Macrorregión</label>
                <input className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold" placeholder="SP - Grande São Paulo" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Descripción</label>
                <textarea className="w-full p-3 border border-slate-300 rounded-lg text-xs font-medium h-20 resize-none" placeholder="Área de cobertura y reglas específicas..." />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reguladores Asignados</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                  <option>Central Estadual de Regulação</option>
                  <option>Complexo Regulador Municipal</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs uppercase rounded-lg hover:bg-slate-800 flex items-center gap-2">
                {loading ? 'Guardando...' : <><Map size={14}/> Crear Territorio</>}
              </button>
            </div>
          </>
        );

      case 'GlobalDirectiveModal':
        return (
          <>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[10px] text-blue-800 font-medium">
                Esta directriz se propagará a todos los nodos federados y tendrá efecto inmediato sobre los motores de decisión locales.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tipo de Dato</label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                    <option>CLINICAL</option>
                    <option>SENSITIVE</option>
                    <option>ADMINISTRATIVE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Finalidad</label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                    <option>TREATMENT</option>
                    <option>PUBLIC_HEALTH</option>
                    <option>AUDIT</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Obligación de Cumplimiento</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                  <option>MANDATORY (Bloqueante)</option>
                  <option>RECOMMENDED (Auditable)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Vigencia</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                  <option>PERMANENTE</option>
                  <option>EMERGENCIA SANITARIA (Temp)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase rounded-lg hover:bg-blue-700 flex items-center gap-2">
                {loading ? 'Emitiendo...' : <><Shield size={14}/> Emitir Directriz</>}
              </button>
            </div>
          </>
        );

      case 'GenerateReportModal':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tipo de Reporte</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                  <option>Auditoría de Accesos Global</option>
                  <option>Mapa de Calor de Riesgos LGPD</option>
                  <option>Eficiencia de Nodos Federados</option>
                  <option>Consolidado de Consentimientos</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Período</label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                    <option>Últimos 30 días</option>
                    <option>Trimestre actual</option>
                    <option>Año fiscal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Territorio</label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                    <option>TODOS</option>
                    <option>SP - Capital</option>
                    <option>RJ - Metropolitana</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Finalidad Específica</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg text-xs font-bold">
                  <option>TODAS</option>
                  <option>TRATAMENTO</option>
                  <option>PESQUISA</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:bg-slate-100 rounded-lg">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white font-bold text-xs uppercase rounded-lg hover:bg-slate-800 flex items-center gap-2">
                {loading ? 'Generando...' : <><FileText size={14}/> Generar Reporte</>}
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!['RegisterNodeModal', 'CreateTerritoryModal', 'GlobalDirectiveModal', 'GenerateReportModal'].includes(activeModal || '')) return null;

  return (
    <div className="bg-white w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
            {activeModal === 'RegisterNodeModal' && <Server size={16} />}
            {activeModal === 'CreateTerritoryModal' && <Map size={16} />}
            {activeModal === 'GlobalDirectiveModal' && <Shield size={16} />}
            {activeModal === 'GenerateReportModal' && <FileText size={16} />}
          </div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            {activeModal === 'RegisterNodeModal' && 'Registrar Nuevo Nodo'}
            {activeModal === 'CreateTerritoryModal' && 'Crear Territorio'}
            {activeModal === 'GlobalDirectiveModal' && 'Nueva Directriz Global'}
            {activeModal === 'GenerateReportModal' && 'Generar Reporte'}
          </h2>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={16}/></button>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};