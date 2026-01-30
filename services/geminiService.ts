
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectFile, AnalysisResult } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProject = async (files: ProjectFile[]): Promise<AnalysisResult> => {
  const ai = getAIClient();
  
  const criticalFiles = files.filter(f => 
    f.name.match(/(package\.json|README\.md|main\.tsx|App\.tsx|index\.tsx|routes\.ts|config\.js|settings\.py|requirements\.txt|go\.mod|Cargo\.toml)/i)
    || f.path.includes('src/')
    || f.path.includes('app/')
  ).slice(0, 20);

  const fileContext = criticalFiles.map(f => `Archivo: ${f.path}\nContenido:\n${f.content.substring(0, 8000)}`).join('\n\n---\n\n');

  const prompt = `Actúa como un Arquitecto de Software Senior. Analiza este proyecto de código y proporciona una visión técnica profunda. 
  Aquí tienes el contexto de los archivos principales:\n\n${fileContext}\n\n
  Por favor, responde exclusivamente en formato JSON con la siguiente estructura:
  {
    "overview": "Resumen ejecutivo de la funcionalidad y propósito",
    "architecture": "Análisis detallado de patrones, estructura de carpetas y flujo de datos",
    "technologies": ["Lista exhaustiva de frameworks, lenguajes y librerías clave"],
    "suggestions": ["5 recomendaciones críticas para mejorar mantenibilidad, rendimiento o escalabilidad"],
    "securityConcerns": ["Auditoría rápida de vulnerabilidades, secretos expuestos o malas prácticas de seguridad"]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            architecture: { type: Type.STRING },
            technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            securityConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["overview", "architecture", "technologies", "suggestions", "securityConcerns"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as AnalysisResult;
  } catch (error) {
    console.error("Error analizando con Gemini:", error);
    throw new Error("No se pudo completar el análisis del proyecto.");
  }
};

export const chatWithProject = async (files: ProjectFile[], question: string) => {
  const ai = getAIClient();
  // Incluimos contenido de archivos para que Gemini sepa de qué hablamos
  // Priorizamos archivos pequeños y relevantes para no exceder límites
  const contextFiles = files.filter(f => f.size < 30000).slice(0, 20);
  const fileContext = contextFiles.map(f => `Ruta: ${f.path}\nContenido:\n${f.content}`).join('\n\n---\n\n');
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Eres un Programador Senior y Copiloto de Desarrollo.
      Estás trabajando DENTRO de un editor de código con el usuario.
      El usuario te enviará preguntas o peticiones de cambio sobre sus archivos.
      Tu objetivo es ayudarle a escribir mejor código, arreglar bugs o implementar nuevas funcionalidades basándote en su contexto actual.
      Si te pide código, dáselo de forma clara y lista para copiar.
      Contexto de los archivos actuales:\n${fileContext}`,
    }
  });

  const response = await chat.sendMessage({ message: question });
  return response.text;
};
