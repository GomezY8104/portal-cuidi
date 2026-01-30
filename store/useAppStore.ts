import { create } from 'zustand';
import { UserSession, UserRole } from '../types';

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

  // Regulação Global State
  attachedDocs: any[];
  setAttachedDocs: (docs: any[]) => void;
  addAttachedDoc: (doc: any) => void;
  removeAttachedDoc: (docId: string) => void;
  
  // Novo Caso State (APS)
  newCaseData: NewCaseState;
  updateNewCaseData: (data: Partial<NewCaseState>) => void;
  resetNewCaseData: () => void;

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
  updateUpaCaseStatus: (id: string, stage: UpaCase['stage'], risk?: string) => void;
  removeUpaCase: (id: string) => void;

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
  updateUpaCaseStatus: (id, stage, risk) => set((state) => ({
    upaQueue: state.upaQueue.map(c => c.id === id ? { ...c, stage, ...(risk ? { risk } : {}) } : c)
  })),
  removeUpaCase: (id) => set((state) => ({
    upaQueue: state.upaQueue.filter(c => c.id !== id),
    removedCaseIds: [...state.removedCaseIds, id] 
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