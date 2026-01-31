
import { create } from 'zustand';
import { UserSession, UserRole } from '../types';
import { MOCK_DOC_REQUESTS, MOCK_PROVIDER_CASES } from '../mocks/seed'; // Importar mocks para estado inicial

// --- Interface de Notificação ---
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Interface para os dados do Novo Caso (Regulação APS)
interface NewCaseState {
  step: number;
  patient: any | null;
  clinicalData: {
    mainDiagnosis: { code: string; description: string };
    secondaryDiagnosis: { code: string; description: string };
    notes: string;
  };
  urgencyData: {
    priority: 'NORMAL' | 'URGENTE' | 'EMERGÊNCIA';
    justification: string;
  };
  selectedRegulators: string[];
}

// Interface para Caso APS na Fila
export interface ApsCase {
  id: string;
  patient: string;
  spec: string;
  priority: string;
  status: string;
  date: string;
  update: string;
  hasMessage?: boolean; // Novo campo para notificação
}

// Interface para Novo Caso UPA (Persistência Global)
interface UpaFlowState {
  step: number;
  patient: any | null;
  clinicalData: {
    history: string;
    mainDiagnosis: { code: string; description: string };
    secondaryDiagnosis: { code: string; description: string };
    glasgow: number;
  };
  vitals: {
    pa: string; fc: string; fr: string; temp: string; spo2: string;
  };
  regData: {
    bedType: string;
    priority: string;
    transportNeeded: boolean;
    transportType: string;
    justification: string;
  };
  selectedRegulators: string[];
}

// Interface para caso UPA expandida
export interface UpaCase {
  id: string;
  patientName: string;
  socialName?: string;
  cpf: string;
  cns?: string;
  age: number;
  gender: string;
  phone?: string;
  emergencyContact?: string;
  address?: string;
  bloodType?: string;
  arrival: string;
  risk: string;
  stage: 'TRIAGEM' | 'MEDICAL' | 'OBSERVATION' | 'REGULATION' | 'DISCHARGED';
  status: string;
  complaint: string;
}

interface AppState {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  isAuthenticated: boolean;

  activeDrawer: string | null;
  drawerData: any | null;
  openDrawer: (id: string, data?: any) => void;
  closeDrawer: () => void;

  activeModal: string | null;
  modalData: any | null;
  openModal: (id: string, data?: any) => void;
  closeModal: () => void;

  // Sistema de Notificações (Toasts)
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;

  // Regulação Global State
  attachedDocs: any[];
  setAttachedDocs: (docs: any[]) => void;
  addAttachedDoc: (doc: any) => void;
  removeAttachedDoc: (docId: string) => void;
  
  // Novo Caso State (APS)
  newCaseData: NewCaseState;
  updateNewCaseData: (data: Partial<NewCaseState>) => void;
  resetNewCaseData: () => void;

  // APS Queue State
  apsQueue: ApsCase[];
  addApsCase: (newCase: ApsCase) => void;

  // Novo Caso State (UPA) - NOVO
  upaFlowData: UpaFlowState;
  updateUpaFlowData: (data: Partial<UpaFlowState>) => void;
  resetUpaFlowData: () => void;

  selectedVagas: any[]; 
  setSelectedVagas: (vagas: any[]) => void;

  // UPA Queue State
  upaQueue: UpaCase[];
  removedCaseIds: string[]; 
  addUpaCase: (newCase: UpaCase) => void;
  updateUpaCaseStatus: (id: string, stage: UpaCase['stage'], risk?: string, statusLabel?: string) => void;
  removeUpaCase: (id: string) => void;

  // Patient Workflow State (NOVO)
  patientDocRequests: any[];
  patientCases: any[];
  resolveDocRequest: (reqId: string) => void; // Ação para mover de Pendência para Histórico

  // Patient Consents State
  patientConsents: any[];
  patientRequests: any[];
  addConsent: (consent: any) => void; // Nova ação
  revokeConsent: (id: string) => void;
  approveRequest: (req: any) => void;
  denyRequest: (id: string) => void;

  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const initialNewCaseState: NewCaseState = {
  step: 1,
  patient: null,
  clinicalData: { 
    mainDiagnosis: { code: '', description: '' }, 
    secondaryDiagnosis: { code: '', description: '' }, 
    notes: '' 
  },
  urgencyData: { priority: 'NORMAL', justification: '' },
  selectedRegulators: []
};

const initialUpaFlowState: UpaFlowState = {
  step: 1,
  patient: null,
  clinicalData: {
    history: '',
    mainDiagnosis: { code: '', description: '' },
    secondaryDiagnosis: { code: '', description: '' },
    glasgow: 15
  },
  vitals: { pa: '', fc: '', fr: '', temp: '', spo2: '' },
  regData: {
    bedType: 'ENFERMARIA',
    priority: 'URGENTE',
    transportNeeded: false,
    transportType: 'NENHUM',
    justification: ''
  },
  selectedRegulators: []
};

// Initial APS Data (Moved from WorkTray)
const initialApsQueue: ApsCase[] = [
  { id: 'APS-24-891', patient: 'MARIA APARECIDA DA SILVA', spec: 'CARDIOLOGIA', priority: 'ALTA', status: 'DEVOLVIDO', date: '25/10/2024', update: 'Hoje, 09:00', hasMessage: true },
  { id: 'APS-24-702', patient: 'JOÃO CARLOS PEREIRA', spec: 'ORTOPEDIA', priority: 'MÉDIA', status: 'EM_REGULACAO', date: '24/10/2024', update: 'Ontem, 16:30', hasMessage: false },
  { id: 'APS-24-204', patient: 'ANA JULIA FONTES', spec: 'NEUROLOGIA', priority: 'BAIXA', status: 'PENDENTE', date: '22/10/2024', update: '22/10/2024', hasMessage: false },
  { id: 'APS-24-205', patient: 'CARLOS EDUARDO', spec: 'ONCOLOGIA', priority: 'ALTA', status: 'QUALIFICADO', date: '20/10/2024', update: '21/10/2024', hasMessage: false },
  { id: 'APS-24-206', patient: 'FERNANDA LIMA', spec: 'GINECOLOGIA', priority: 'ALTA', status: 'FINALIZADO', date: '15/10/2024', update: '18/10/2024', hasMessage: true },
  
];

// --- LÓGICA DE RECUPERAÇÃO DE SESSÃO ---
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('cuidi_user_session');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Erro ao recuperar sessão", e);
    return null;
  }
};

const initialUser = getStoredUser();

export const useAppStore = create<AppState>((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  setUser: (user) => {
    if (user) {
      localStorage.setItem('cuidi_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('cuidi_user_session');
    }
    set({ user, isAuthenticated: !!user });
  },

  activeDrawer: null,
  drawerData: null,
  openDrawer: (id, data) => set({ activeDrawer: id, drawerData: data }),
  closeDrawer: () => set({ activeDrawer: null, drawerData: null }),

  activeModal: null,
  modalData: null,
  openModal: (id, data) => set({ activeModal: id, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Notifications Logic
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ notifications: [...state.notifications, { ...notification, id }] }));
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
      }, notification.duration || 4000);
    }
  },
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),

  attachedDocs: [],
  setAttachedDocs: (docs) => set({ attachedDocs: docs }),
  addAttachedDoc: (doc) => set((state) => ({ 
    attachedDocs: state.attachedDocs.find(d => d.id === doc.id) 
      ? state.attachedDocs 
      : [...state.attachedDocs, doc] 
  })),
  removeAttachedDoc: (docId) => set((state) => ({ 
    attachedDocs: state.attachedDocs.filter(d => d.id !== docId) 
  })),

  newCaseData: initialNewCaseState,
  updateNewCaseData: (data) => set((state) => ({
    newCaseData: { 
      ...state.newCaseData, 
      ...data,
      clinicalData: data.clinicalData 
        ? { ...state.newCaseData.clinicalData, ...data.clinicalData }
        : state.newCaseData.clinicalData
    }
  })),
  resetNewCaseData: () => set({ 
    newCaseData: initialNewCaseState, 
    attachedDocs: [] 
  }),

  // APS Queue
  apsQueue: initialApsQueue,
  addApsCase: (newCase) => set((state) => ({ apsQueue: [newCase, ...state.apsQueue] })),

  // UPA Flow Actions (Persistência de Estado)
  upaFlowData: initialUpaFlowState,
  updateUpaFlowData: (data) => set((state) => ({
    upaFlowData: {
      ...state.upaFlowData,
      ...data,
      clinicalData: data.clinicalData ? { ...state.upaFlowData.clinicalData, ...data.clinicalData } : state.upaFlowData.clinicalData,
      vitals: data.vitals ? { ...state.upaFlowData.vitals, ...data.vitals } : state.upaFlowData.vitals,
      regData: data.regData ? { ...state.upaFlowData.regData, ...data.regData } : state.upaFlowData.regData,
    }
  })),
  resetUpaFlowData: () => set({ upaFlowData: initialUpaFlowState, attachedDocs: [] }),

  selectedVagas: [],
  setSelectedVagas: (vagas) => set({ selectedVagas: vagas }),

  upaQueue: [],
  removedCaseIds: [], 
  addUpaCase: (newCase) => set((state) => ({ upaQueue: [newCase, ...state.upaQueue] })),
  updateUpaCaseStatus: (id, stage, risk, statusLabel) => set((state) => ({
    upaQueue: state.upaQueue.map(c => c.id === id ? { 
        ...c, 
        stage, 
        ...(risk ? { risk } : {}),
        ...(statusLabel ? { status: statusLabel } : {})
    } : c)
  })),
  removeUpaCase: (id) => set((state) => ({
    upaQueue: state.upaQueue.filter(c => c.id !== id),
    removedCaseIds: [...state.removedCaseIds, id] 
  })),

  // Patient Workflow State
  patientDocRequests: MOCK_DOC_REQUESTS,
  patientCases: MOCK_PROVIDER_CASES,
  resolveDocRequest: (reqId) => set((state) => {
    // 1. Remove da lista de pendências
    const remainingRequests = state.patientDocRequests.filter(r => r.id !== reqId);
    
    // 2. Opcional: Poderia atualizar um caso associado se tivéssemos o link direto
    // Aqui apenas removemos para simular que foi "resolvido/enviado"
    
    return { patientDocRequests: remainingRequests };
  }),

  // Patient Consents Actions
  patientConsents: [
    { id: 'C1', inst: 'Hospital das Clínicas', segment: 'HOSPITAL', types: 'CLÍNICO, EXAMES', purpose: 'TRATAMENTO', validity: 'PERMANENTE' },
    { id: 'C2', inst: 'UBS Jardim Norte', segment: 'APS', types: 'TODOS', purpose: 'TRATAMENTO', validity: 'PERMANENTE' },
  ],
  patientRequests: [
    { id: 'R1', inst: 'Lab Laboris', data: 'Dados Cadastrais', purpose: 'CONFIRMAÇÃO', status: 'PENDENTE' },
    { id: 'R2', inst: 'Seguradora de Saúde', data: 'Laudos 2024', purpose: 'AUDITORIA', status: 'PENDENTE' }
  ],
  
  addConsent: (consent) => set((state) => ({
    patientConsents: [consent, ...state.patientConsents]
  })),

  revokeConsent: (id) => set((state) => ({
    patientConsents: state.patientConsents.filter(c => c.id !== id)
  })),
  
  approveRequest: (req) => set((state) => {
    const newConsent = {
        id: `NEW-${Math.random().toString(36).substr(2, 5)}`,
        inst: req.inst,
        segment: 'EXTERNO',
        types: req.data,
        purpose: req.purpose,
        validity: '30 DIAS'
    };
    return {
      patientConsents: [...state.patientConsents, newConsent],
      patientRequests: state.patientRequests.filter(r => r.id !== req.id)
    };
  }),
  
  denyRequest: (id) => set((state) => ({
    patientRequests: state.patientRequests.filter(r => r.id !== id)
  })),

  language: (localStorage.getItem('lang') as any) || 'pt',
  setLanguage: (lang) => {
    localStorage.setItem('lang', lang);
    set({ language: lang });
  },

  theme: (localStorage.getItem('theme') as any) || 'light',
  toggleTheme: () => set((state) => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    return { theme: next };
  }),

  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
}));
