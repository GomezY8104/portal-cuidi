import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, Calendar, Clock, Video, MapPin, 
  AlertTriangle, CheckCircle, ArrowRight, 
  Stethoscope, Building2, ShieldAlert, HeartPulse, Activity
} from 'lucide-react';

export const PatientScheduleModal: React.FC = () => {
  const { closeModal, modalData } = useAppStore();
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<'PRESENCIAL' | 'TELEMEDICINA'>('PRESENCIAL');

  // Datos del prestador (pasados desde la búsqueda o dashboard)
  const provider = modalData || { name: 'Rede de Saúde Federada', address: 'Unidade mais próxima' };

  const slots = [
    { time: '08:30', available: true },
    { time: '09:00', available: false },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '16:30', available: true },
  ];

  const handleConfirm = () => {
    setStep(3); // Éxito
  };

  return (
    <div className="bg-white w-full max-w-2xl mx-auto flex flex-col h-[85vh] md:h-auto md:max-h-[800px]">
      
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Agendamento Inteligente</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Triaje & Reserva</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        
        {/* PASO 1: TRIAJE DE SEGURIDAD (Safety Check) */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-amber-50 border-2 border-amber-100 rounded-[2rem] p-8 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                   <ShieldAlert size={32} />
                </div>
                <h3 className="text-2xl font-black text-amber-900 uppercase tracking-tight">Verificação de Segurança</h3>
                <p className="text-amber-800 font-medium text-sm max-w-md mx-auto leading-relaxed">
                   Para sua segurança, responda com honestidade antes de prosseguir com o agendamento:
                </p>
                <div className="bg-white p-6 rounded-2xl border border-amber-200 text-left space-y-4 shadow-inner mt-4">
                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest text-center mb-2">Você apresenta algum destes sintomas AGORA?</p>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-100 text-red-800 text-xs font-bold"><HeartPulse size={16}/> Dor no Peito</div>
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-100 text-red-800 text-xs font-bold"><Activity size={16}/> Falta de Ar Intensa</div>
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-100 text-red-800 text-xs font-bold"><AlertTriangle size={16}/> Perda de Consciência</div>
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-100 text-red-800 text-xs font-bold"><Activity size={16}/> Sangramento Forte</div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={closeModal} 
                  className="p-6 bg-red-600 text-white rounded-2xl text-left hover:bg-red-700 transition-all group shadow-xl shadow-red-200"
                >
                   <p className="text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2"><AlertTriangle size={14}/> SIM, TENHO SINTOMAS</p>
                   <p className="font-bold text-lg">Buscar Urgência (UPA)</p>
                   <p className="text-[10px] text-red-100 mt-2 leading-tight opacity-90">O sistema irá direcioná-lo para a emergência mais próxima imediatamente.</p>
                </button>

                <button 
                  onClick={() => setStep(2)} 
                  className="p-6 bg-emerald-600 text-white rounded-2xl text-left hover:bg-emerald-700 transition-all group shadow-xl shadow-emerald-200 relative overflow-hidden"
                >
                   <div className="absolute right-[-10px] top-[-10px] opacity-10"><CheckCircle size={100}/></div>
                   <p className="text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2"><Stethoscope size={14}/> NÃO, É DE ROTINA</p>
                   <p className="font-bold text-lg">Continuar Agendamento</p>
                   <p className="text-[10px] text-emerald-100 mt-2 leading-tight opacity-90">Para consultas eletivas, retornos, receitas ou sintomas leves.</p>
                </button>
             </div>
          </div>
        )}

        {/* PASO 2: SELECCIÓN DE TURNO */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
             
             {/* Selector de Modalidad */}
             <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setAppointmentType('PRESENCIAL')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${appointmentType === 'PRESENCIAL' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <Building2 size={16}/> No Consultório
                </button>
                <button 
                  onClick={() => setAppointmentType('TELEMEDICINA')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${appointmentType === 'TELEMEDICINA' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <Video size={16}/> Telemedicina
                </button>
             </div>

             {/* Info del Prestador */}
             <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                   <Building2 size={24}/>
                </div>
                <div>
                   <h4 className="font-black text-slate-900 text-sm">{provider.name}</h4>
                   <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12}/> {provider.address}
                   </p>
                </div>
             </div>

             {/* Grid de Horarios */}
             <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horários para Amanhã</p>
                   <p className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">Ver Calendário Completo</p>
                </div>
                <div className="grid grid-cols-4 gap-3">
                   {slots.map((slot, i) => (
                      <button 
                        key={i}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                           !slot.available ? 'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed decoration-slice line-through' :
                           selectedSlot === slot.time ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' :
                           'bg-white text-slate-600 border-slate-100 hover:border-blue-400 hover:text-blue-600'
                        }`}
                      >
                         {slot.time}
                      </button>
                   ))}
                </div>
             </div>

             <div className="pt-4 border-t border-slate-100">
                <button 
                  disabled={!selectedSlot}
                  onClick={handleConfirm}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
                >
                  Confirmar Reserva <ArrowRight size={16}/>
                </button>
             </div>
          </div>
        )}

        {/* PASO 3: CONFIRMACIÓN */}
        {step === 3 && (
           <div className="text-center py-10 space-y-6 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200 mb-6">
                 <CheckCircle size={48} />
              </div>
              <div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Agendado!</h2>
                 <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto mt-2">
                    Sua consulta foi confirmada. Não é necessário ir à unidade antes do horário.
                 </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 text-left space-y-4 shadow-sm mx-auto max-w-sm">
                 <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Data/Hora</span>
                    <span className="text-xs font-bold text-slate-900">Amanhã, {selectedSlot}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Modalidade</span>
                    <span className="text-xs font-bold text-blue-600">{appointmentType}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Local</span>
                    <span className="text-xs font-bold text-slate-900 text-right truncate w-32">{provider.name}</span>
                 </div>
              </div>

              <button onClick={closeModal} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-slate-800 transition-all">
                 Ver em "Meus Processos"
              </button>
           </div>
        )}

      </div>
    </div>
  );
};