
# Portal CUIDI - Plataforma Federada de Regulação do SUS

<div align="center">
  <img src="https://via.placeholder.com/1200x400?text=Portal+CUIDI+Federado" alt="Banner CUIDI" />
</div>

## Sobre o Projeto

O **Portal CUIDI** é uma plataforma de interoperabilidade e regulação assistencial federada para o Sistema Único de Saúde (SUS). O sistema permite a gestão transparente de filas, troca de documentos clínicos entre unidades (Hospitais, UPAs, UBSs) e garante a soberania dos dados do paciente através de governança baseada em Ledger e LGPD.

### Funcionalidades Principais

*   **Busca Federada:** Localização de documentos clínicos em qualquer nó da rede.
*   **Gestão de Filas (UPA/APS):** Controle de fluxo com classificação de risco Manchester.
*   **Orquestração de Vagas:** Regulação inteligente baseada em distância e capacidade.
*   **Governança LGPD:** Controle granular de consentimento e auditoria de acesso.
*   **Portal do Paciente:** Acesso ao histórico clínico e controle de privacidade.

## Stack Tecnológica

*   **Frontend:** React 19, TypeScript, Vite
*   **Estilização:** Tailwind CSS
*   **Ícones:** Lucide React
*   **Gerenciamento de Estado:** Zustand
*   **IA:** Google Gemini API (para auditoria de código e assistente virtual)

## Como Rodar Localmente

**Pré-requisitos:** Node.js (versão 18 ou superior).

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_USUARIO/portal-cuidi.git
    cd portal-cuidi
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave da API do Google Gemini:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    ```

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```

## Estrutura do Projeto

*   `/src/features`: Módulos funcionais (Admin, Paciente, Profissional).
*   `/src/components`: Componentes reutilizáveis de UI e Modais.
*   `/src/store`: Gerenciamento de estado global (Zustand).
*   `/src/services`: Integração com APIs e IA.

---
Desenvolvido para modernização da saúde pública.
