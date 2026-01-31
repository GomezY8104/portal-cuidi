
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { X, UserPlus, Save, Loader2, MapPin, Hash, User, Phone, Heart, AlertCircle } from 'lucide-react';

export const RegisterPatientModal: React.FC = () => {
  const { closeModal, addUpaCase, modalData } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Estado local del formulario completo
  const [formData, setFormData] = useState({
    name: '',
    socialName: '',
    cpf: '',
    cns: '',
    birthDate: '',
    gender: 'MASCULINO',
    bloodType: 'NÃO SABE',
    phone: '',
    emergencyContact: '',
    address: ''
  });

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // LÓGICA CONDICIONAL: 
      // Se houver um callback 'onPatientRegistered', estamos no fluxo APS (apenas cadastro).
      // Caso contrário, assumimos fluxo de Recepção UPA (cria caso na fila).
      
      if (modalData?.onPatientRegistered) {
          const newPatient = {
            id: `P-${Math.floor(Math.random() * 10000)}`,
            name: formData.name,
            socialName: formData.socialName,
            cpf: formData.cpf,
            cns: formData.cns,
            birthDate: formData.birthDate,
            age: calculateAge(formData.birthDate), // Add calculated age for consistency
            gender: formData.gender,
            phone: formData.phone,
            emergencyContact: formData.emergencyContact,
            address: formData.address,
            bloodType: formData.bloodType
          };
          
          modalData.onPatientRegistered(newPatient);
          setLoading(false);
          closeModal();
          // NÃO NAVEGAR PARA /UPA
          return;
      }

      // FLUXO PADRÃO UPA (ADMISSÃO)
      const newCaseId = `UPA-NEW-${Math.floor(Math.random() * 10000)}`;
      addUpaCase({
        id: newCaseId,
        patientName: formData.name,
        socialName: formData.socialName,
        cpf: formData.cpf,
        cns: formData.cns,
        age: calculateAge(formData.birthDate),
        gender: formData.gender,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
        address: formData.address,
        bloodType: formData.bloodType,
        arrival: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        risk: 'INDEFINIDO',
        stage: 'TRIAGEM',
        status: 'Aguardando Classificação',
        complaint: 'Admissão Recepção'
      });

      setLoading(false);
      closeModal();
      navigate('/upa'); // Navega a la lista de trabajo UPA
    }, 1000);
  };

  const isApsContext = !!modalData?.onPatientRegistered;

  return (
    <div className="bg-white flex flex-col h-[90vh]">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isApsContext ? 'Cadastrar Paciente' : 'Novo Cadastro SUS'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isApsContext ? 'Base Nacional de Saúde' : 'Recepção UPA • Dados Completos'}
            </p>
          </div>
        </div>
        <button onClick={closeModal} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors"><X size={24}/></button>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        
        {/* IDENTIFICACIÓN BÁSICA */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Identificação Pessoal</h3>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Civil Completo *</label>
              <input 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold uppercase text-sm" 
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Social (Se houver)</label>
              <input 
                value={formData.socialName}
                onChange={e => setFormData({...formData, socialName: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold uppercase text-sm"
                placeholder="Nome de preferência do paciente"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data Nascimento *</label>
                <input 
                  required 
                  type="date" 
                  value={formData.birthDate}
                  onChange={e => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sexo Biológico / Gênero</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm appearance-none cursor-pointer"
                >
                   <option value="MASCULINO">Masculino</option>
                   <option value="FEMININO">Feminino</option>
                   <option value="OUTRO">Outro / Indefinido</option>
                </select>
              </div>
           </div>
        </section>

        {/* DOCUMENTOS E CLÍNICO BÁSICO */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mt-2">Documentação e Dados Vitais</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CPF *</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                   <input 
                     required 
                     value={formData.cpf}
                     onChange={e => setFormData({...formData, cpf: e.target.value})}
                     placeholder="000.000.000-00" 
                     className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm" 
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cartão SUS (CNS) *</label>
                <div className="relative">
                   <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                   <input 
                     required 
                     value={formData.cns}
                     onChange={e => setFormData({...formData, cns: e.target.value})}
                     placeholder="7000..." 
                     className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm" 
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo Sanguíneo</label>
                <div className="relative">
                   <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                   <select 
                     value={formData.bloodType}
                     onChange={e => setFormData({...formData, bloodType: e.target.value})}
                     className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm appearance-none cursor-pointer" 
                   >
                     <option value="NÃO SABE">Não Sabe</option>
                     <option value="A+">A+</option>
                     <option value="A-">A-</option>
                     <option value="B+">B+</option>
                     <option value="B-">B-</option>
                     <option value="AB+">AB+</option>
                     <option value="AB-">AB-</option>
                     <option value="O+">O+</option>
                     <option value="O-">O-</option>
                   </select>
                </div>
              </div>
           </div>
        </section>

        {/* CONTATO & ENDEREÇO */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mt-2">Contato & Localização</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefone Celular *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                    <input 
                      required 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 90000-0000" 
                      className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm" 
                    />
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-red-500 flex items-center gap-1"><AlertCircle size={10}/> Contato de Emergência</label>
                  <input 
                    value={formData.emergencyContact}
                    onChange={e => setFormData({...formData, emergencyContact: e.target.value})}
                    placeholder="(00) 0000-0000 (Nome)" 
                    className="w-full p-4 bg-red-50 border border-red-100 rounded-xl outline-none focus:border-red-500 font-bold text-sm text-red-900 placeholder-red-300" 
                  />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Endereço Completo *</label>
              <div className="relative">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                 <input 
                   required 
                   value={formData.address}
                   onChange={e => setFormData({...formData, address: e.target.value})}
                   placeholder="Rua, Número, Bairro, Cidade - UF" 
                   className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold text-sm uppercase" 
                 />
              </div>
           </div>
        </section>

      </form>

      <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20}/> {isApsContext ? 'Salvar Paciente na Base' : 'Salvar e Confirmar Admissão'}</>}
        </button>
      </div>
    </div>
  );
};
