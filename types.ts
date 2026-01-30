
/**
 * Enum de Papéis (Roles) do sistema conforme especificado.
 */
export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  NODE_ADMIN = 'NODE_ADMIN',
  APS = 'APS',
  UPA = 'UPA',
  REGULATOR = 'REGULATOR',
  PROVIDER = 'PROVIDER',
  MANAGER = 'MANAGER',
  AUDITOR = 'AUDITOR',
  PATIENT = 'PATIENT'
}

/**
 * Status das solicitações de acesso.
 */
export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
  EXPIRED = 'expired'
}

/**
 * Tipos de dados (LGPD).
 */
export type DataType = 'IDENTIFICATION' | 'CLINICAL' | 'EXAMS' | 'PRESCRIPTIONS' | 'RESTRICTED';

/**
 * Estrutura da Sessão do Usuário.
 */
export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  nodeName: string;
  registryNumber?: string; // CRM, COREN, etc.
  specialty?: string;
}

/**
 * Entidade de Pedido de Acesso Restrito.
 */
export interface RestrictedAccessRequest {
  id: string;
  patientId: string;
  caseId?: string;
  requesterOrgId: string;
  requesterRole: UserRole;
  requestedDataTypes: DataType[];
  purpose: string;
  justification: string;
  status: RequestStatus;
  createdAt: string;
  expiresAt: string;
  patientDecisionNote?: string;
}

/**
 * Evento do Ledger de Compartilhamento.
 */
export interface LedgerEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorOrgId: string;
  patientId: string;
  action: string;
  dataType: DataType;
  decision: 'APPROVED' | 'DENIED';
  policyId?: string;
  consentId?: string;
}

/**
 * Representa um arquivo do projeto para processamento pela IA.
 */
export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  size: number;
}

/**
 * Estrutura do resultado da análise técnica gerada pela IA.
 */
export interface AnalysisResult {
  overview: string;
  architecture: string;
  technologies: string[];
  suggestions: string[];
  securityConcerns: string[];
}
