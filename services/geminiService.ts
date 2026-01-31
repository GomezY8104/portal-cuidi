// Polyfill global fetch para Node.js (Vite backend)
import fetch from 'node-fetch';
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
// Este archivo ya no es necesario. Toda la lógica de Gemini está en el backend proxy.

// API Key fixa para auditoria IA de administrador
const getAIClient = () => new GoogleGenerativeAI("AIzaSyBb6JbZagOCLathuXlSlEWF2rOOsSMaaLw");
// Contexto técnico da API (Documentação Mockada para a IA)
const API_DOCS_CONTEXT = `
VOCÊ É UM ARQUITETO DE SOLUÇÕES SÊNIOR DA PLATAFORMA FEDERADA CUIDI.
// Contexto de Dados (Estrutura para análise de KPIs)
const DATA_ANALYST_CONTEXT = `
VOCÊ É UM CIENTISTA DE DADOS SÊNIOR DO SUS.
export const sendFederationMessage = async (
  message: string, 
  mode: 'API_SUPPORT' | 'DATA_INSIGHTS', 
  const ai = getAIClient();
  let systemInstruction = '';
  if (mode === 'API_SUPPORT') {
    systemInstruction = API_DOCS_CONTEXT;
  } else {
    const dataString = JSON.stringify(currentSystemData || {}, null, 2);
    systemInstruction = DATA_ANALYST_CONTEXT.replace('{{CURRENT_DATA}}', dataString);
  }
  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-pro',
      systemInstruction,
    const result = await model.generateContent([ { role: 'user', parts: [{ text: message }] } ]);
    return result.response.text();
  } catch (error) {
    console.error("Erro no Assistente CUIDI:", error);
    return "Desculpe, o serviço de inteligência federada está temporariamente indisponível. Verifique sua chave de API.";
  }
};

import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key fixa para auditoria IA de administrador
const getAIClient = () => new GoogleGenerativeAI("AIzaSyBb6JbZagOCLathuXlSlEWF2rOOsSMaaLw");

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
  const ai = getAIClient();
  let systemInstruction = '';
  if (mode === 'API_SUPPORT') {
    systemInstruction = API_DOCS_CONTEXT;
  } else {
    const dataString = JSON.stringify(currentSystemData || {}, null, 2);
    systemInstruction = DATA_ANALYST_CONTEXT.replace('{{CURRENT_DATA}}', dataString);
  }
  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-pro',
      systemInstruction,
      generationConfig: { temperature: 0.4 }
    });
    const result = await model.generateContent([ { role: 'user', parts: [{ text: message }] } ]);
    return result.response.text();
  } catch (error) {
    console.error("Erro no Assistente CUIDI:", error);
    return "Desculpe, o serviço de inteligência federada está temporariamente indisponível. Verifique sua chave de API.";
  }
};
