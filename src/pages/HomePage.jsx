import { useState, useEffect } from 'react'
import '../styles/App.css'
import { FiMenu, FiUser, FiTrendingUp, FiCreditCard } from "react-icons/fi";
import { SiLangchain } from "react-icons/si";
import { useNavigate } from 'react-router-dom'
const BASE_URL = import.meta.env.VITE_API_URL


const getShortId = (shortUrl) => {
  try {
    const parsed = new URL(shortUrl)
    const parts = parsed.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1]
  } catch {
    return ''
  }
}

const shortenUrl = async (url) => {
  const userData = sessionStorage.getItem("user")
  let response

  if (userData !== "undefined") {

    alert('Usuário não autenticado. Por favor, faça login para encurtar URLs.')
    response = await fetch(`${BASE_URL}/short`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
  } else {
    alert('Usuário autenticado. Encurtando URL com token de acesso.')
    const token = localStorage.getItem("access_token")
    response = await fetch(`${BASE_URL}/short`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url }),
    })
  }

  if (!response.ok) {
    throw new Error('Erro ao encurtar URL')
  }

  return await response.json()
}


function App({ onLogout}) {
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (userData && userData !== "undefined") {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Informe uma URL válida para encurtar.')
      return
    }

    try {
      setStatus('loading')
      const response = await shortenUrl(url.trim())
      const shortId = getShortId(response.short_url)

      if (!shortId) {
        throw new Error('Resposta invalida da API')
      }

      const qrUrl = `${BASE_URL}/${shortId}/qrcode`

      setResult({
        shortUrl: response.short_url,
        qrUrl,
        originalUrl: response.url,
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError('Não foi possível encurtar agora. Tente novamente.')
    }
  }

  const handleCopy = async () => {
    if (!result?.shortUrl) return
    await navigator.clipboard.writeText(result.shortUrl)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((currentValue) => !currentValue)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="app">

      <div
        className={`sidebar-overlay${isSidebarOpen ? ' is-open' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!isSidebarOpen}
      ></div>

      <aside className={`sidebar-panel${isSidebarOpen ? ' is-open' : ''}`}>
        <div className="sidebar-panel-header">
          <p className="sidebar-panel-title">Menu</p>
          <button className="sidebar-close-button" type="button" onClick={closeSidebar} aria-label="Fechar menu lateral">
            x
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navegacao lateral">
          <button className="sidebar-link" type="button" onClick={closeSidebar}>
            <FiTrendingUp /> Métricas
          </button>
          <button className="sidebar-link" type="button" onClick={() => { closeSidebar(); navigate('/links') }}>
            <SiLangchain /> URLs
          </button>
          <button className="sidebar-link" type="button" onClick={closeSidebar}>
            <FiCreditCard /> Planos
          </button>
          {user ? (
            <>
              <button className="sidebar-link" type="button" onClick={closeSidebar}>
                <FiUser />
                {user.name || user.email}
              </button>
              <button className="sidebar-link" type="button" onClick={onLogout}>
                Sair
              </button>
            </>
          ) : (
            <button className="sidebar-link" type="button" onClick={() => navigate('/login')}>
              <FiUser />
              Login/Cadastrar
            </button>
          )}
        </nav>
      </aside>

      <div className="sidebar-trigger">
        <button className="menu-button" type="button" onClick={toggleSidebar} aria-label="Abrir menu lateral" aria-expanded={isSidebarOpen}>
          <FiMenu />
        </button>
      </div>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"></span>
          BlueLink
        </div>


      </header>

      <main className="hero">
        <section className="intro">
          <p className="eyebrow">URL shortener · Fast API</p>
          <h1>Transforme links longos em URLs profissionais.</h1>
          <p className="lead">
            Cole a URL, gere a versão curta e receba o QR para compartilhar em
            campanhas, documentos e apresentações.
          </p>

          <form className="shortener-form" onSubmit={handleSubmit}>
            <label htmlFor="url-input">Cole a URL completa</label>
            <div className="input-row">
              <input
                id="url-input"
                type="url"
                placeholder="https://sua-empresa.com/pagina"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                autoComplete="off"
                required
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Gerando...' : 'Encurtar'}
              </button>
            </div>
            <span className="helper">
              Ideal para links de marketing, vendas e relatórios.
            </span>
            {error ? <span className="error">{error}</span> : null}
          </form>
        </section>

        <section className="result">
          <div className="result-card">
            <div className="result-header">
              <h2>Resultado</h2>
              <span className="status">
                {status === 'loading' && 'Gerando'}
                {status === 'success' && 'Pronto'}
                {status === 'idle' && 'Aguardando'}
                {status === 'error' && 'Falhou'}
              </span>
            </div>

            <div className="qr-area">
              {result?.qrUrl ? (
                <img src={result.qrUrl} alt="QR da URL encurtada" />
              ) : (
                <div className="qr-placeholder">
                  QR Code da URL curta
                </div>
              )}
            </div>

            <div className="result-info">
              <p className="label">URL encurtada</p>
              <div className="short-url">
                <span>{result?.shortUrl || 'https://encurta.dev/...'}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!result?.shortUrl}
                >
                  Copiar
                </button>
              </div>
              <p className="label">URL original</p>
              <p className="original-url">
                {result?.originalUrl || 'A URL original aparecerá aqui'}
              </p>
            </div>
          </div>
        </section>
      </main>

      <section className="footer">
        <div>
          <p className="footer-title">Fluxo pensado para equipes</p>
          <p className="footer-text">
            Encurte, compartilhe com QR e monitore quando a integração estiver
            pronta.
          </p>
        </div>
        <div className="pill-list">
          <span>Seguro</span>
          <span>Rápido</span>
          <span>Consistente</span>
        </div>
      </section>
    </div>
  )
}

export default App
