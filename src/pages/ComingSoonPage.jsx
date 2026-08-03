import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/register.css'
import { FiMenu, FiUser, FiTrendingUp, FiCreditCard } from "react-icons/fi";
import { SiLangchain } from "react-icons/si";

function ComingSoonPage(onLogout, user, setUser ) {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
    setIsSidebarOpen((currentValue) => !currentValue)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <main className="app">
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
          <button className="sidebar-link" type="button" onClick={() => { closeSidebar(); navigate('/') }}>
            <FiTrendingUp /> Home
          </button>
          <button className="sidebar-link" type="button" onClick={() => { closeSidebar(); navigate('/links') }}>
            <SiLangchain /> URLs
          </button>
          <button className="sidebar-link" type="button" onClick={closeSidebar}>
            <FiCreditCard /> Planos
          </button>
          <button className="sidebar-link" type="button" onClick={() => { closeSidebar(); navigate('/coming-soon') }}>
            <FiTrendingUp /> Métricas
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
      
      
      <div >
        
        <section className="coming-soon-section">
          <h1>Em Breve!</h1> <br />

          <p>Estamos trabalhando para trazer novas funcionalidades e melhorias para você. Fique atento às atualizações!</p>
        </section>
      </div>
    </main>
  )
}

export default ComingSoonPage
