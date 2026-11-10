# BemDoar — frontend

MVP web em React 18, Vite, React Router, JavaScript e CSS. O nome oficial da instituição parceira está pendente de confirmação pelo PO; os dados iniciais são apenas demonstrativos. O escopo revisado em 04/11/2026 abrange necessidades e doações físicas. Campanhas, voluntariado, ações e painel de transparência ficam fora deste MVP.

## Rodar

```sh
npm install
npm run dev
```

Abra `http://localhost:5173` com o backend rodando em `http://localhost:8080`. `npm run build` valida a compilação. Login de demonstração: `admin@bemdoar.com` / `admin123` ou `maria@email.com` / `maria123`.

## O que conferir

- `/necessidades`: lista e progresso público; necessidade `ATENDIDA` não oferece nova intenção.
- `/admin/necessidades/nova`: o administrador cadastra necessidade com justificativa. Ao editar, justifica a alteração.
- `/doar/necessidade/{id}`: doador registra intenção e recebe protocolo. A intenção não altera o progresso.
- `/minhas-doacoes`: titular acompanha protocolo, quantidade prometida, recebida e prazos.
- `/admin/doacoes`: administrador pesquisa protocolo, confirma, confere recebimento parcial, corrige ou anula com justificativa e consulta a auditoria.

Prazos de três dias para análise e 15 dias para entrega, contados no mesmo horário em `America/Sao_Paulo`. A aprovação é manual. O item físico deve corresponder ao declarado.

O código de API fica em `src/servicos/api.js`, autenticação em `src/servicos/auth.js`, rotas em `src/App.jsx` e telas em `src/paginas/`.
