# 📘 Capicash - Guia do Projeto (Status Atual)

**Bem-vindo ao Capicash!** 
Este documento serve como um mapa para entender o que estamos construindo, como as peças se encaixam e em que pé estamos. Se você acabou de chegar (seja estagiário, investidor ou curioso), comece por aqui.

---

## 🚀 1. O que é o Capicash?
O Capicash é uma **plataforma de monetização simplificada**. 
Imagine um "Gumroad" ou "Kiwify", mas focado na extrema simplicidade e no pagamento instantâneo via **Pix**.

**O Fluxo Mágico:**
1.  **Vendedor** cria uma conta e cadastra um produto (ex: um E-book ou acesso a um grupo VIP).
2.  O sistema gera um **Link de Pagamento** (Checkout).
3.  **Comprador** clica, paga com Pix.
4.  O sistema detecta o pagamento e **entrega o produto** automaticamente.
5.  O dinheiro cai na conta do vendedor (menos a nossa taxa 💸).

---

## 🏗️ 2. Arquitetura (Como é feito?)
O projeto é dividido em duas grandes partes (Repositório Monorepo):

### 🎨 Frontend (A "Cara" do site)
*   **Onde fica:** Pasta `/frontend`
*   **Tecnologia:** React + Vite + TailwindCSS.
*   **Design:** Usamos componentes prontos e bonitos (Shadcn/ui) com um tema "Dark/Aurora" moderno.
*   **Estado Atual:** **90% Pronto**.
    *   ✅ Login/Cadastro (com Clerk).
    *   ✅ Dashboard (Gráficos e métricas).
    *   ✅ Criação de Produtos.
    *   ✅ Página de Checkout (Visual pronto, mas falta conectar o pagamento real).

### ⚙️ Backend (O "Cérebro" e o Cofre)
*   **Onde fica:** Pasta `/backend`
*   **Tecnologia:** NestJS (Node.js) + PostgreSQL (Banco de Dados).
*   **Segurança:** Autenticação via Clerk, Validação de dados rigorosa.
*   **Estado Atual:** **50% Pronto (Fundação Sólida)**.
    *   ✅ Banco de Dados desenhado (Tabelas de Usuários, Produtos, Transações).
    *   ✅ Segurança implementada (Ninguém entra sem chave).
    *   🚧 **Em Construção:** A integração com o banco (Abacate Pay) para gerar o Pix de verdade.

---

## 🚦 3. Status do Desenvolvimento (O que falta?)

Estamos na fase de **"Conectar os Fios"**. Temos um carro lindo (Frontend) e um motor potente (Backend), mas falta colocar gasolina (Integração de Pagamentos).

| Módulo | Status | O que significa? |
| :--- | :--- | :--- |
| **Autenticação** | 🟢 Pronto | Login e Cadastro funcionam perfeitamente. |
| **Produtos** | 🟡 Parcial | Dá para criar produtos, mas falta validar melhor os dados. |
| **Checkout** | 🔴 Pendente | A tela existe, mas o QR Code do Pix ainda não é gerado. |
| **Entregas** | 🔴 Pendente | O sistema ainda não libera o produto após o pagamento. |
| **Saques** | 🔴 Pendente | O vendedor vê o saldo (fake), mas não consegue sacar. |

---

## 🛠️ 4. Tecnologias para "Não-Técnicos"

*   **Docker:** É como uma "caixa mágica" que garante que o banco de dados funcione igual no meu computador e no seu.
*   **Prisma:** É o tradutor que permite que nosso código converse com o Banco de Dados sem precisar escrever SQL complicado.
*   **Clerk:** É um serviço terceirizado que cuida da segurança do Login (Senhas, Email, Google Login), para não precisarmos reinventar a roda.
*   **Abacate Pay:** É o nosso parceiro bancário. Eles processam o Pix e nos avisam quando o dinheiro cai.

---

## 🏁 5. Como rodar o projeto?

Se você é desenvolvedor, aqui está o resumo:

1.  **Banco de Dados:** `docker-compose up -d` (na pasta raiz ou backend).
2.  **Backend:** `cd backend` -> `pnpm install` -> `pnpm start:dev`.
3.  **Frontend:** `cd frontend` -> `pnpm install` -> `pnpm dev`.

---

> **Resumo da Ópera:** O Capicash está visualmente pronto e estruturalmente seguro. O foco total agora é na **Integração Financeira** (fazer o Pix funcionar).
