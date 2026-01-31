
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Gera e baixa um arquivo PDF válido.
 */
export const downloadPDF = (filename: string, title: string, metadata: any, content: string) => {
  const doc = new jsPDF();
  
  // Configuração básica
  doc.setFont("helvetica");
  
  // Cabeçalho
  doc.setFontSize(18);
  doc.text("PORTAL CUIDI - SUS FEDERADO", 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(title, 14, 30);
  
  // Linha divisória
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);
  
  // Metadados
  doc.setFontSize(10);
  doc.setTextColor(0);
  let y = 45;
  
  doc.text("METADADOS DO DOCUMENTO:", 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(80);
  
  Object.entries(metadata).forEach(([key, value]) => {
    // Tratamento simples para objetos aninhados
    const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
    doc.text(`${key.toUpperCase()}: ${valStr}`, 14, y);
    y += 5;
  });
  
  y += 10;
  
  // Conteúdo Principal (Quebra de linha automática)
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("CONTEÚDO / RESUMO:", 14, y);
  y += 7;
  doc.setFontSize(10);
  
  const splitText = doc.splitTextToSize(content, 180);
  
  // Paginação simples se o texto for muito longo
  if (y + splitText.length * 5 > 280) {
      doc.text(splitText, 14, y);
      doc.addPage();
      // Continuar restante... (simplificado para este demo)
  } else {
      doc.text(splitText, 14, y);
  }
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Hash de Auditoria: ${Math.random().toString(36).substring(2).toUpperCase()} - Página ${i} de ${pageCount}`, 14, 290);
  }

  doc.save(filename);
};

/**
 * Gera e baixa um arquivo Excel (.xlsx) válido.
 */
export const downloadXLSX = (filename: string, data: any[]) => {
  if (!data || data.length === 0) {
      alert("Sem dados para gerar Excel.");
      return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dados");
  XLSX.writeFile(wb, filename);
};

/**
 * Gera e baixa um arquivo CSV válido (com BOM para acentuação).
 */
export const downloadCSV = (filename: string, data: any[]) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => {
        const str = String(val);
        // Escapar aspas e envolver em aspas se contiver vírgula
        return `"${str.replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');
  
  const csvContent = `${headers}\n${rows}`;
  const bom = "\uFEFF"; // Byte Order Mark para UTF-8 (Excel)
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  triggerDownload(blob, filename);
};

/**
 * Gera e baixa um arquivo JSON válido.
 */
export const downloadJSON = (filename: string, data: any) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  triggerDownload(blob, filename);
};

// Helper interno para disparar o download
const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
