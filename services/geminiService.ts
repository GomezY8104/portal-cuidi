


// Contexto técnico da API (Documentação Mockada para a IA)
const API_DOCS_CONTEXT = `
VOCÊ É UM ARQUITETO DE SOLUÇÕES SÊNIOR DA PLATAFORMA FEDERADA CUIDI.
Sua função é ajudar administradores a integrar novos nós e resolver problemas de API.

DADOS TÉCNICOS DA FEDERAÇÃO:
1. Autenticação: mTLS (Mutual TLS) obrigatório para todos os nós. Tokens JWT assinados com certificado A3.
2. Endpoints Principais:
   - POST /v1/connect: Handshake inicial.
   - GET /v1/patient/{cns}: Busca federada de paciente.
   - POST /v1/audit/log: Registro obrigatório no Ledger.
3. Erros Comuns:
   - 401 Unauthorized: Certificado revogado ou expirado.
   - 403 Forbidden: Nó sem política ativa para o tipo de dado solicitado.
   - 429 Too Many Requests: Limite de rate limit (1000 req/min).
4. Padrão de Dados:
   - Utilizamos FHIR R4 para dados clínicos.
   - JSON simples para metadados de auditoria.

Responda dúvidas sobre como conectar, exemplos de JSON, curl, e diagnósticos de erro.
`;

// Contexto de Dados (Estrutura para análise de KPIs)
const DATA_ANALYST_CONTEXT = `
VOCÊ É UM CIENTISTA DE DADOS SÊNIOR DO SUS.
Sua função é analisar métricas operacionais e logs de auditoria para encontrar anomalias e sugerir melhorias.

DADOS ATUAIS DO SISTEMA (Snapshot):
{{CURRENT_DATA}}

Responda perguntas sobre tendências, gargalos e segurança com base APENAS nesses dados. Seja conciso e executivo.
`;

export const sendFederationMessage = async (
  message: string, 
  mode: 'API_SUPPORT' | 'DATA_INSIGHTS', 
  currentSystemData?: any
) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, mode, currentSystemData })
    });

    // Mejor manejo de error según código HTTP
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return "⚠️ Erro de Autenticação: Sua chave de API parece ser inválida, expirou ou não tem permissões.";
      }
      if (response.status === 400) {
        return "⚠️ Erro de Configuração: A chave de API do Google Gemini não foi detectada ou está mal configurada.\n\nPara ativar o Copiloto, adicione a variável de ambiente `API_KEY` nas configurações do projeto.";
      }
      return "Desculpe, o serviço de inteligência federada está temporariamente indisponível. Tente novamente em instantes.";
    }

    // Leer respuesta JSON
    const data = await response.json();
    // Si la API backend devuelve un error específico en el cuerpo
    if (data?.error) {
      return `⚠️ Erro: ${data.error}`;
    }
    return data.text;

  } catch (error) {
    console.error("Erro no Assistente CUIDI:", error);
    return "Desculpe, o serviço de inteligência federada está temporariamente indisponível. Tente novamente em instantes.";
  }
};
