# Tutorial da Sidebar Lateral

Este documento explica, de forma didatica, como a sidebar lateral foi implementada no projeto.

## 1. Objetivo

A ideia era fazer um menu lateral com animacao que aparece quando o usuario clica no botao com a classe `menu-button`.

O comportamento final ficou assim:

- ao clicar no botao, a sidebar entra pela esquerda
- um overlay escuro aparece por tras
- ao clicar no botao de fechar ou no overlay, a sidebar fecha

## 2. Controle de estado no React

Na `HomePage.jsx`, foi criado um estado para controlar se a sidebar esta aberta ou fechada:

```jsx
const [isSidebarOpen, setIsSidebarOpen] = useState(false)
```

Esse estado comeca com `false`, ou seja, a sidebar inicia fechada.

Tambem foram criadas duas funcoes:

```jsx
const toggleSidebar = () => {
  setIsSidebarOpen((currentValue) => !currentValue)
}

const closeSidebar = () => {
  setIsSidebarOpen(false)
}
```

### O que cada funcao faz

- `toggleSidebar`: alterna entre aberto e fechado
- `closeSidebar`: fecha a sidebar diretamente

## 3. Ligando o botao ao estado

O botao com a classe `menu-button` passou a usar `onClick`:

```jsx
<button
  className="menu-button"
  type="button"
  onClick={toggleSidebar}
  aria-label="Abrir menu lateral"
  aria-expanded={isSidebarOpen}
>
  <FiMenu />
</button>
```

### Por que isso e importante

- `type="button"` evita comportamento de submit por engano
- `onClick={toggleSidebar}` abre e fecha o menu
- `aria-expanded` melhora acessibilidade e informa o estado atual

## 4. Estrutura visual da sidebar

Foram adicionados dois blocos principais:

1. overlay
2. painel lateral

### Overlay

```jsx
<div
  className={`sidebar-overlay${isSidebarOpen ? ' is-open' : ''}`}
  onClick={closeSidebar}
  aria-hidden={!isSidebarOpen}
></div>
```

Esse overlay serve para:

- escurecer o fundo
- permitir fechar a sidebar ao clicar fora dela

### Painel lateral

```jsx
<aside className={`sidebar-panel${isSidebarOpen ? ' is-open' : ''}`}>
```

Aqui foi usado um `aside` porque ele representa bem uma area lateral complementar da interface.

Dentro dele foram colocados:

- um cabecalho com titulo
- um botao de fechar
- links de exemplo

## 5. Como a animacao funciona

No CSS, a sidebar foi criada inicialmente fora da tela:

```css
.sidebar-panel {
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
```

Quando a classe `is-open` e adicionada, ela entra na tela:

```css
.sidebar-panel.is-open {
  transform: translateX(0);
}
```

### Logica da animacao

- `translateX(-100%)`: deixa o painel escondido a esquerda
- `translateX(0)`: traz o painel para a posicao visivel
- `transition`: cria o efeito suave da entrada e saida

## 6. Como o overlay aparece

O overlay tambem comeca escondido:

```css
.sidebar-overlay {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
```

Quando a sidebar abre:

```css
.sidebar-overlay.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
```

### O papel de cada propriedade

- `opacity: 0`: invisivel
- `visibility: hidden`: escondido visualmente
- `pointer-events: none`: nao recebe clique
- `pointer-events: auto`: passa a aceitar clique quando aberto

## 7. Z-index e camadas

Foi necessario organizar as camadas com `z-index`:

- `.sidebar-overlay` usa `z-index: 20`
- `.sidebar-panel` usa `z-index: 30`

Assim:

- o overlay fica acima do conteudo
- o painel fica acima do overlay

## 8. Responsividade

No mobile, a largura da sidebar foi ajustada:

```css
@media (max-width: 960px) {
  .sidebar-panel {
    width: min(280px, 88vw);
  }
}
```

Isso impede que o menu ocupe espaco demais em telas pequenas.

## 9. Resumo da implementacao

Passo a passo resumido:

1. criar um estado com `useState`
2. ligar o botao `menu-button` ao `onClick`
3. renderizar um overlay
4. renderizar um painel lateral
5. adicionar classes condicionais com base no estado
6. usar `transform` e `transition` no CSS
7. permitir fechamento clicando fora ou no botao de fechar

## 10. Melhorias futuras

Se quiser evoluir essa sidebar depois, voce pode:

- colocar links reais com `Link` do `react-router-dom`
- adicionar animacao de itens internos
- fechar a sidebar com a tecla `Escape`
- destacar a rota ativa
- adicionar logout dentro da sidebar
