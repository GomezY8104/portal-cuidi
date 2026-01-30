
import { UserRole, DataType } from '../types';

/**
 * Entrada para avaliação de governança.
 */
export interface GovernanceInput {
  role: UserRole;
  orgId: string;
  patientId: string;
  dataType: DataType;
  purpose: string;
  action: string;
}

/**
 * Resultado da avaliação.
 */
export interface GovernanceDecision {
  decision: 'APPROVED' | 'DENIED' | 'CONDITIONAL';
  justification: string;
  policyId?: string;
  consentId?: string;
  obligations: string[];
}

/**
 * Avalia de forma determinística se um acesso é permitido com base nas políticas de federação e LGPD.
 */
export const evaluateGovernance = (input: GovernanceInput): GovernanceDecision => {
  const { role, dataType, purpose } = input;

  // Lógica de "Regras de Ouro":
  // 1. System Admin vê quase tudo para auditoria, mas limitado.
  if (role === UserRole.SYSTEM_ADMIN) {
    return {
      decision: 'APPROVED',
      justification: 'Acesso concedido para fins de administração global do sistema.',
      obligations: ['Registrar evento no Ledger Global', 'Notificar paciente se dado sensível']
    };
  }

  // 2. Paciente acessando seus próprios dados.
  if (role === UserRole.PATIENT) {
    return {
      decision: 'APPROVED',
      justification: 'Autodeterminação informativa do titular.',
      obligations: []
    };
  }

  // 3. Acesso Restrito exige fluxo especial.
  if (dataType === 'RESTRICTED') {
    return {
      decision: 'DENIED',
      justification: 'Dados restritos exigem solicitação formal e consentimento explícito.',
      obligations: ['Acionar fluxo RequestRestrictedAccess']
    };
  }

  // 4. Fluxo básico para profissionais de saúde.
  if (['APS', 'UPA', 'REGULATOR', 'PROVIDER'].includes(role) && purpose === 'TREATMENT') {
    return {
      decision: 'APPROVED',
      justification: 'Acesso permitido por política de nó padrão para continuidade assistencial.',
      policyId: 'POL-AUTO-NODE',
      obligations: ['Registrar no prontuário local', 'Válido apenas por 24h']
    };
  }

  return {
    decision: 'DENIED',
    justification: 'Não foi encontrada política federada ou consentimento ativo para este contexto.',
    obligations: []
  };
};
