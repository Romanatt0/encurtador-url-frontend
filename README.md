# BlueLink Frontend

Frontend em React + Vite para um encurtador de URLs com autenticacao, tela de login, tela de cadastro e area protegida para gerar links curtos e QR Code.

## Funcionalidades

- Login com chamada para a API
- Cadastro com validacao basica no frontend
- Rota protegida para a tela principal
- Encurtamento de URLs via API
- Exibicao do QR Code da URL encurtada
- Copia da URL curta para a area de transferencia

## Tecnologias

- React
- Vite
- React Router

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Configure a variavel de ambiente em um arquivo `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Para gerar a build de producao:

```bash
npm run build
```

## Estrutura

- `src/main.jsx`
  Inicializa o React e o `BrowserRouter`.

- `src/App.jsx`
  Define as rotas `/login`, `/register` e `/`.
  Tambem controla o token em estado React para o redirecionamento funcionar apos o login.

- `src/routes/ProtectedRoute.jsx`
  Bloqueia acesso a rotas privadas quando o usuario nao esta autenticado.

- `src/pages/LoginPage.jsx`
  Tela de login integrada com a API.

- `src/pages/RegisterPage.jsx`
  Tela de cadastro com validacao basica e retorno para o login.

- `src/pages/HomePage.jsx`
  Tela principal protegida do encurtador.

- `src/styles/App.css`
  Estilos da tela principal.

- `src/styles/login.css`
  Estilos isolados da tela de login.

- `src/styles/register.css`
  Estilos isolados da tela de cadastro.

- `src/index.css`
  Variaveis globais, tema e reset basico.

## Fluxo de autenticacao

1. O usuario acessa `/login`.
2. Ao enviar o formulario, o frontend chama `POST /user/login`.
3. Se a API retornar `access_token`, o token e salvo no `localStorage` e no estado do React.
4. O usuario e redirecionado para `/`.
5. A rota `/` passa por `ProtectedRoute` e libera a `HomePage` apenas quando existe autenticacao.

## Fluxo do encurtador

1. O usuario informa uma URL na `HomePage`.
2. O frontend chama `POST /short`.
3. A resposta retorna a URL original e a URL curta.
4. O app extrai o identificador da URL curta e monta a URL do QR Code.
5. O resultado e exibido na interface.

## Observacoes

- O cadastro atual esta pronto no frontend, mas ainda nao envia dados para uma API.
- O login depende de `VITE_API_URL` estar configurado corretamente.
