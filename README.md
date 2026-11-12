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

## Prévia no Firebase Hosting

O projeto Firebase configurado é `bem-doar-projeto-integrador`. A prévia publica apenas a interface React e dados fictícios de demonstração. Ela exibe um aviso permanente; login, cadastro e registro de doações não funcionam enquanto a API Spring Boot estiver só no computador local. O site de produção não usa Firebase Authentication nem Analytics, portanto **não precisa instalar o SDK JavaScript mostrado na tela de cadastro do app**. O Hosting usa a CLI e o arquivo `firebase.json`.

Para publicar a prévia, faça login na conta que tem acesso ao projeto e rode, nesta pasta:

```sh
npx firebase-tools login
npm run deploy:firebase
```

O comando gera `dist/` em modo de demonstração e publica no Hosting. Após o deploy, abra `https://bem-doar-projeto-integrador.web.app/necessidades/1` para verificar o fallback de rota do React. Se o projeto ainda não tiver o Hosting ativado no console, ative **Firebase Hosting** nele antes de rodar o deploy.

Para rodar a aplicação completa localmente, use `npm run dev` com a API em `http://localhost:8080`. Quando o backend estiver publicado em HTTPS, remova o modo de demonstração da configuração de publicação e defina `VITE_API_URL` com a URL real da API antes de gerar o build. Configure também `bemdoar.cors.origem` no backend para o domínio do Hosting e use um banco persistente adequado ao servidor. Não publique o H2 local ou as senhas de demonstração como dados reais.
