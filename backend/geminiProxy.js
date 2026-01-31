// Gemini Proxy API (Node.js Express)
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyBb6JbZagOCLathuXlSlEWF2rOOsSMaaLw";
const genAI = new GoogleGenAI({ apiKey: API_KEY });

const API_DOCS_CONTEXT = `VOCÊ É UM ARQUITETO DE SOLUÇÕES SÊNIOR DA PLATAFORMA FEDERADA CUIDI.\nSua função é ajudar administradores a integrar novos nós e resolver problemas de API.\nDADOS TÉCNICOS DA FEDERAÇÃO:\n1. Autenticação: mTLS (Mutual TLS) obrigatório para todos os nós. Tokens JWT assinados com certificado A3.\n2. Endpoints Principais:\n   - POST /v1/connect: Handshake inicial.\n   - GET /v1/patient/{cns}: Busca federada de paciente.\n   - POST /v1/audit/log: Registro obrigatório no Ledger.\n3. Erros Comuns:\n   - 401 Unauthorized: Certificado revogado ou expirado.\n   - 403 Forbidden: Nó sem política ativa para o tipo de dado solicitado.\n   - 429 Too Many Requests: Limite de rate limit (1000 req/min).\n4. Padrão de Dados:\n   - Utilizamos FHIR R4 para dados clínicos.\n   - JSON simples para metadados de auditoria.\nResponda dúvidas sobre como conectar, exemplos de JSON, curl, e diagnósticos de erro.`;
const DATA_ANALYST_CONTEXT = `VOCÊ É UM CIENTISTA DE DADOS SÊNIOR DO SUS.\nSua função é analisar métricas operacionais e logs de auditoria para encontrar anomalias e sugerir melhorias.\nDADOS ATUAIS DO SISTEMA (Snapshot):\n{{CURRENT_DATA}}\nResponda perguntas sobre tendências, gargalos e segurança com base APENAS nesses dados. Seja conciso e executivo.`;

app.post('/api/gemini', async (req, res) => {
  const { message, mode, currentSystemData } = req.body;
  let systemInstruction = '';
  if (mode === 'API_SUPPORT') {
    systemInstruction = API_DOCS_CONTEXT;
  } else {
    const dataString = JSON.stringify(currentSystemData || {}, null, 2);
    systemInstruction = DATA_ANALYST_CONTEXT.replace('{{CURRENT_DATA}}', dataString);
  }
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        { role: 'user', parts: [{ text: message }] }
      ],
      systemInstruction,
      generationConfig: { temperature: 0.4 }
    });
    res.json({ text: result.text });
  } catch (error) {
    console.error('Gemini Proxy Error:', error);
    res.status(500).json({ text: 'Desculpe, o serviço de inteligência federada está temporariamente indisponível. Verifique sua chave de API.' });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Gemini Proxy API running on port ${PORT}`);
});
