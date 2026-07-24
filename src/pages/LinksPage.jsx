import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/links.css'
import { FiMenu, FiUser, FiTrendingUp, FiCreditCard, FiCopy, FiExternalLink, FiCalendar } from "react-icons/fi";
import { SiLangchain } from "react-icons/si";

const BASE_URL = import.meta.env.VITE_API_URL

function LinksPage({ onLogout }) {
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (userData && userData !== "undefined") {
      setUser(JSON.parse(userData))
    }
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setStatus('loading')
      const response = await fetch(`${BASE_URL}/all_links`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        throw new Error('Erro ao carregar links')
      }

      const data = await response.json()
      setLinks(data.links || [])
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Não foi possível carregar seus links.')
    }
  }

  const handleCopy = async (shortUrl, index) => {
    await navigator.clipboard.writeText(shortUrl)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((currentValue) => !currentValue)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const isExpired = (dateStr) => {
    if (!dateStr) return false
    return new Date(dateStr) < new Date()
  }

  return (
    <div className="links-app">
      <div
        className={`links-sidebar-overlay${isSidebarOpen ? ' is-open' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!isSidebarOpen}
      ></div>

      <aside className={`links-sidebar-panel${isSidebarOpen ? ' is-open' : ''}`}>
        <div className="links-sidebar-panel-header">
          <p className="links-sidebar-panel-title">Menu</p>
          <button className="links-sidebar-close-button" type="button" onClick={closeSidebar} aria-label="Fechar menu lateral">
            x
          </button>
        </div>

        <nav className="links-sidebar-nav" aria-label="Navegacao lateral">
          <button className="links-sidebar-link" type="button" onClick={() => { closeSidebar(); navigate('/') }}>
            <FiTrendingUp /> Início
          </button>
          <button className="links-sidebar-link" type="button" onClick={() => { closeSidebar(); navigate('/links') }}>
            <SiLangchain /> URLs
          </button>
          <button className="links-sidebar-link" type="button" onClick={closeSidebar}>
            <FiCreditCard /> Planos
          </button>
          {user ? (
            <>
              <button className="links-sidebar-link" type="button" onClick={closeSidebar}>
                <FiUser />
                {user.name || user.email}
              </button>
              <button className="links-sidebar-link" type="button" onClick={onLogout}>
                Sair
              </button>
            </>
          ) : (
            <button className="links-sidebar-link" type="button" onClick={() => navigate('/login')}>
              <FiUser />
              Login/Cadastrar
            </button>
          )}
        </nav>
      </aside>

      <div className="links-sidebar-trigger">
        <button className="links-menu-button" type="button" onClick={toggleSidebar} aria-label="Abrir menu lateral" aria-expanded={isSidebarOpen}>
          <FiMenu />
        </button>
      </div>

      <header className="links-topbar">
        <div className="links-brand">
          <span className="links-brand-mark" aria-hidden="true"></span>
          BlueLink
        </div>
        <span className="links-brand-tag">Meus Links</span>
      </header>

      <main className="links-main">
        <div className="links-header">
          <h1>Meus Links</h1>
          <p className="links-header-sub">Todas as URLs que você encurtou</p>
        </div>

        {status === 'loading' && (
          <div className="links-state">
            <div className="links-loading-spinner"></div>
            <p>Carregando seus links...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="links-state">
            <p className="links-error-text">{error}</p>
            <button className="links-retry-button" type="button" onClick={fetchLinks}>
              Tentar novamente
            </button>
          </div>
        )}

        {status === 'success' && links.length === 0 && (
          <div className="links-state">
            <div className="links-empty-icon">
              <SiLangchain />
            </div>
            <p className="links-empty-title">Nenhum link encontrado</p>
            <p className="links-empty-text">Você ainda não encurtou nenhuma URL.</p>
            <button className="links-retry-button" type="button" onClick={() => navigate('/')}>
              Encurtar minha primeira URL
            </button>
          </div>
        )}

        {status === 'success' && links.length > 0 && (
          <div className="links-list">
            {links.map((link, index) => {
              const shortCode = link.short_url.split('/').pop()
              const expDate = formatDate(link.expiration_date)
              const expired = isExpired(link.expiration_date)

              return (
                <div className="links-card" key={index}>
                  <div className="links-card-top">
                    <div className="links-card-main">
                      <div className="links-short-code">
                        <span className="links-code">{link.short_url}</span>
                        <button
                          className="links-copy-btn"
                          type="button"
                          onClick={() => handleCopy(link.short_url, index)}
                          title="Copiar URL curta"
                        >
                          {copiedIndex === index ? 'Copiado!' : <FiCopy />}
                        </button>
                      </div>
                      <a
                        className="links-original-url"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiExternalLink size={12} />
                        {link.url}
                      </a>
                    </div>
                    <div className="links-card-meta">
                      {expDate ? (
                        <span className={`links-expiration${expired ? ' expired' : ''}`}>
                          <FiCalendar size={12} />
                          {expired ? 'Expirado em ' : 'Expira em '}
                          {expDate}
                        </span>
                      ) : (
                        <span className="links-expiration never">
                          <FiCalendar size={12} />
                          Sem expiração
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default LinksPage
