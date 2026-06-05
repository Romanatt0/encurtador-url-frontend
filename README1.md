# BlueLink Frontend (React + Vite)

Projeto didatico para aprender React construindo a interface de um encurtador de URLs.
O foco esta no frontend, com integracao direta com a sua API FastAPI.

## Como rodar

```bash
npm install
npm run dev
```

## Estrutura do projeto (o que cada arquivo faz)

### Raiz do projeto

- `index.html`
  - HTML base carregado pelo Vite.
  - Contem a `div#root` onde o React monta o app.

- `package.json`
  - Lista dependencias e scripts (dev, build, preview).
  - Use `npm run dev` para rodar em modo desenvolvimento.

- `vite.config.js`
  - Configuracoes do Vite (build, plugins).
  - Aqui fica o plugin do React.

- `README.md`
  - Este guia didatico.

### Pasta `src/`

- `src/main.jsx`
  - Entrada do React.
  - Cria a raiz com `createRoot` e renderiza o `App`.
  - Importa `index.css` com estilos globais.

- `src/App.jsx`
  - Componente principal da interface.
  - Contem o formulario, o card de resultado e o layout geral.
  - Usa estados (`useState`) para controlar:
    - `url`: o que o usuario digita.
    - `result`: a URL encurtada + QR vindos da API.
    - `status`: idle | loading | success | error.
    - `error`: mensagens simples de validacao/erro.
  - Define `BASE_URL` para apontar para sua API (hoje: `http://127.0.0.1:8000`).

- `src/App.css`
  - Estilos do layout e componentes da tela.
  - Define a identidade visual corporativa (azul escuro), cards e form.
  - Responsivo para mobile (quebra do grid e do formulario).

- `src/index.css`
  - Estilos globais e variaveis de tema (`:root`).
  - Define tipografias, cores, fundo e configuracoes basicas.
  - Importa fontes do Google Fonts.

- `src/assets/`
  - Pasta reservada para imagens e icones locais.
  - No momento nao e usada pelo layout atual, mas pode ser reaproveitada.

## Como funciona o fluxo do encurtador

1) Usuario digita a URL no input.
2) Ao enviar, o `handleSubmit` chama `shortenUrl`.
3) A API retorna `{ url, short_url }`.
4) O app extrai o `short_id` e monta `BASE_URL/{short_id}/qrcode`.
5) O resultado aparece no card (URL curta + QR + URL original).
5) O botao **Copiar** usa `navigator.clipboard` para copiar a URL curta.

## Onde ajustar a API

No `src/App.jsx`, altere apenas o `BASE_URL` caso a sua API mude de endereco.

```js
const BASE_URL = 'http://127.0.0.1:8000'
```
