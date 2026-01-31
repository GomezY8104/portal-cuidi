// Gemini Proxy API (Node.js Express)
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyBb6JbZagOCLathuXlSlEWF2rOOsSMaaLw";
const gemini = new GoogleGenerativeAI(API_KEY);

const API_DOCS_CONTEXT = `VOCÊ É UM ARQUITETO DE SOLUÇÕES SÊNIOR DA PLATAFORMA FEDERADA CUIDI.\nSua função é ajudar administradores a integrar novos nós e resolver problemas de API.\n...`;
const DATA_ANALYST_CONTEXT = `VOCÊ É UM CIENTISTA DE DADOS SÊNIOR DO SUS.\nSua função é analisar métricas operacionais e logs de auditoria para encontrar anomalias e sugerir melhorias.\nDADOS ATUAIS DO SISTEMA (Snapshot):\n{{CURRENT_DATA}}\n...`;

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
    const model = gemini.getGenerativeModel({
      model: 'gemini-pro',
      systemInstruction,
      generationConfig: { temperature: 0.4 }
    });
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: message }] }
    ]);
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error('Gemini Proxy Error:', error);
    res.status(500).json({ text: 'Desculpe, o serviço de inteligência federada está temporariamente indisponível. Verifique sua chave de API.' });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Gemini Proxy API running on port ${PORT}`);
});
