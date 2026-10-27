# BemDoar - Frontend


## Sistema de gestão organizacional social 
O BemDoar é um sistema de gestão dedicado a uma única organização social, desenvolvido em parceria real com o clube do idoso Nina Cruz (Gama-DF)
O objetivo é organizar, em um unico sistema, as informaçoes, necessidades, doações sociais da instituiçoes 
React 18 + Vite + React Router. JavaScript puro (sem TypeScript) e CSS puro.

## Rodar

    npm install     (so na primeira vez)
    npm run dev

Abre em http://localhost:5173

O backend precisa estar rodando em http://localhost:8080 ao mesmo tempo.

## Estrutura

    src/servicos/api.js      unico arquivo que fala com o backend
    src/servicos/auth.js     guarda quem esta logado
    src/componentes/         menu do topo e protecao de rota
    src/paginas/             uma pasta por modulo
    src/styles.css           todo o CSS do projeto
    src/App.jsx              mapa de enderecos (rotas)

## Telas-molde

    src/paginas/categorias/CategoriaListaPage.jsx   tela de lista
    src/paginas/categorias/CategoriaFormPage.jsx    tela de formulario

Copie estes dois arquivos e troque os nomes. Nao comece do zero.

## Arquivos compartilhados

`src/App.jsx` e `src/componentes/Layout.jsx` sao editados por todos,
mas cada frente tem a SUA secao marcada com comentario. Mexa so na sua.

<!-- Submissao do Frontend -->
