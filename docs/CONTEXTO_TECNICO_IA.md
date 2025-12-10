# 🧠 Contexto Técnico do Capicash (Snapshot)

**Data:** 08/12/2025
**Objetivo:** Fornecer contexto completo para uma IA auxiliar no desenvolvimento.

---

## 1. Visão Geral
O **Capicash** é uma plataforma de monetização de links (Checkout Simplificado) focada em Pix.
*   **Frontend:** React (Vite) + Tailwind + Shadcn/ui.
*   **Backend:** NestJS + Prisma + PostgreSQL.
*   **Infra:** Docker Compose (Banco).
*   **Auth:** Clerk.
*   **Pagamentos:** Abacate Pay (Ainda não integrado).

---

## 2. Estrutura de Pastas (Monorepo)
```text
/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/ (Guardas do Clerk)
│   │   │   ├── products/ (CRUD de Links)
│   │   │   ├── users/ (Dados do usuário)
│   │   │   ├── checkout/ (⚠️ VAZIO - Falta implementar)
│   │   │   └── webhooks/ (⚠️ VAZIO - Falta implementar)
│   │   ├── app.module.ts (Configurado com Joi + Global AuthGuard)
│   │   └── main.ts (Global ValidationPipe)
│   ├── prisma/schema.prisma (Schema definido)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (AppLayout, AuthLayout - Otimizados)
│   │   │   └── ui/ (Shadcn)
│   │   ├── pages/
│   │   │   ├── auth/ (Login/Register com tratamento de erro Clerk)
│   │   │   ├── public/ (CheckoutPage visualmente pronta)
│   │   │   └── dashboard/
│   └── package.json
└── docs/
```

---

## 3. Stack Tecnológica (Versões Chave)

### Backend
*   **Framework:** NestJS v11
*   **ORM:** Prisma v5.22
*   **Banco:** PostgreSQL 15 (Docker)
*   **Validação:** `class-validator`, `joi`
*   **Auth:** `@clerk/clerk-sdk-node` (via Middleware/Guard customizado)

### Frontend
*   **Build:** Vite v7.2
*   **Framework:** React v19
*   **Router:** React Router v7.9
*   **Estilo:** TailwindCSS v4 + Shadcn/ui
*   **Auth:** `@clerk/clerk-react` v5.57
*   **HTTP:** Axios

---

## 4. Banco de Dados (Schema Atual)
O banco já possui as tabelas essenciais para o MVP:

*   **User:** ID do Clerk, Pix Key, Plano.
*   **Product:** Título, Preço (centavos), Slug, RedirectUrl.
*   **CheckoutSession:** Status (PENDING/PAID), GatewayId (Abacate), PixCode.
*   **Transaction:** Registro financeiro imutável (Bruto, Taxa, Líquido).
*   **Balance:** Saldo do vendedor.
*   **Withdrawals:** Pedidos de saque.

---

## 5. Status Atual & Problemas Conhecidos

### ✅ O que está pronto:
1.  **Frontend Visual:** Dashboards, Login (Dark Mode corrigido), Checkout UI.
2.  **Backend Base:** Conexão com Banco, CRUD de Produtos, Autenticação Global.
3.  **Segurança:** Validação de Env Vars, AuthGuard Global, ValidationPipe.

### ⚠️ Problemas Ativos:
1.  **Clerk Password Policy:** A API do Clerk retorna erro 422 (`form_password_pwned`) para senhas fracas.
    *   *Solução:* O usuário deve desativar "Password Protection" no Dashboard do Clerk.
2.  **Lag no Frontend:**
    *   *Solução:* Corrigido removendo renderizações duplicadas do `AuroraBackground`.

### 🚧 O que FALTA (Próximos Passos):
1.  **Integração Abacate Pay:** O backend não gera Pix ainda.
2.  **Webhooks:** Não processamos o pagamento (o saldo não atualiza).
3.  **Entrega:** O usuário paga e não recebe o link.

---

## 6. Checklist de Execução Imediata
(Baseado no `execution_checklist.md`)

1.  [ ] **Backend:** Criar `AbacateService` (Adapter para API).
2.  [ ] **Backend:** Implementar `POST /checkout` (Gerar Pix).
3.  [ ] **Frontend:** Conectar botão "Pagar" ao endpoint.
4.  [ ] **Backend:** Criar Webhook Handler (Receber `PAID`).
