# BlueLink Frontend

Frontend em React + Vite para um encurtador de URLs com autenticacao, sidebar responsiva, geração de QR Code e auto-login.

## Funcionalidades

- Login com chamada para a API (JWT access/refresh tokens)
- Auto-login: ao recarregar a pagina, o app tenta validar o token ou fazer refresh automaticamente
- Cadastro com validacao basica no frontend
- Sidebar responsiva com menu lateral animado
- Encurtamento de URLs via API
- Exibicao do QR Code da URL encurtada
- Copia da URL curta para a area de transferencia
- Design responsivo (mobile e desktop)

## Tecnologias

- React 19
- Vite 8
- React Router DOM v7
- react-icons

## Scripts

```bash
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Gera a build de producao em dist/
npm run preview    # Visualiza a build de producao localmente
npm run lint       # Executa o ESLint no projeto
```

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Configure a variavel de ambiente em um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://127.0.0.1:8000
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Para gerar e visualizar a build de producao:

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```
├── public/
│   ├── favicon.svg          # Icone do app
│   └── icons.svg            # Sprite de icones SVG
│
├── src/
│   ├── main.jsx             # Ponto de entrada, inicializa BrowserRouter
│   ├── App.jsx              # Rotas, estado de autenticacao e auto-login
│   ├── index.css            # Variaveis globais, tema, fontes e reset
│   │
│   ├── pages/
│   │   ├── HomePage.jsx     # Tela principal com encurtador e sidebar
│   │   ├── LoginPage.jsx    # Tela de login integrada com a API
│   │   └── RegisterPage.jsx # Tela de cadastro com validacao basica
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx # Componente de guarda de rotas (existente, nao utilizado)
│   │
│   └── styles/
│       ├── App.css          # Estilos da HomePage
│       ├── login.css        # Estilos da LoginPage
│       └── register.css     # Estilos da RegisterPage
│
├── .env                     # Variavel de ambiente (VITE_API_URL)
├── vite.config.js           # Configuracao do Vite
├── eslint.config.js         # Configuracao do ESLint (flat config)
└── package.json
```

## Fluxo de autenticacao

1. O usuario acessa `/login` e envia email + senha.
2. O frontend chama `POST /user/login` na API.
3. A API retorna `access_token`, `refresh_token` e dados do `user`.
4. Os tokens sao salvos em `localStorage` e os dados do usuario em `sessionStorage`.
5. O usuario e redirecionado para `/`.
6. Ao recarregar a pagina, o app verifica se existe um `access_token` valido:
   - Se sim, valida com `GET /user/me`.
   - Se nao, tenta fazer refresh com `POST /user/refresh` usando o `refresh_token`.
   - Se ambos falharem, o usuario e redirecionado para `/login`.
7. O logout limpa `localStorage` e `sessionStorage` e reseta o estado do React.

## Fluxo do encurtador

1. O usuario informa uma URL na `HomePage`.
2. O frontend valida se a URL nao esta vazia.
3. O frontend chama `POST /short` com a URL informada.
4. A resposta retorna a URL original e a URL curta.
5. O app extrai o identificador da URL curta e monta a URL do QR Code (`{BASE_URL}/{shortId}/qrcode`).
6. O QR Code e exibido na interface junto com a URL curta e a URL original.
7. O usuario pode copiar a URL curta para a area de transferencia.

## Observacoes

- O cadastro esta pronto no frontend, mas ainda nao envia dados para uma API.
- O login depende de `VITE_API_URL` estar configurado corretamente.
- A sidebar possui itens de menu placeholder (Metricas, URLs, Planos) que ainda nao estao conectados a rotas.
- `ProtectedRoute.jsx` existe em `src/routes/`, mas a verificacao de autenticacao e feita inline no `App.jsx` via operador ternario.
- `metrics.jsx` e uma pagina em desenvolvimento/duplicata da HomePage, ainda nao roteada.
- O diretorio `context/` existe mas esta vazio; a autenticacao e gerenciada via prop drilling.
