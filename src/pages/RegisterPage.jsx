import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/register.css'
import { FiMenu, FiUser, FiTrendingUp, FiCreditCard } from "react-icons/fi";
import { SiLangchain } from "react-icons/si";

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Preencha todos os campos.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais.')
      return
    }

    setError('')
    navigate('/login')
  }

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
          <button className="sidebar-link" type="button" onClick={() => { closeSidebar(); navigate('/coming-soon') }}>
            <FiCreditCard /> Planos
          </button>
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
      
      
      <div className="register-page">
        
        <section className="register-section">
          <form className="register-form" onSubmit={handleSubmit}>
            <p className="register-form-label">Crie sua conta</p>
          
            <label htmlFor="register-name">Nome</label>
            <input
              type="text"
              id="register-name"
              placeholder="Digite seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <label htmlFor="register-email">Email</label>
            <input
              type="email"
              id="register-email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label htmlFor="register-password">Senha</label>
            <input
              type="password"
              id="register-password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <label htmlFor="register-confirm-password">Confirmar senha</label>
            <input
              type="password"
              id="register-confirm-password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />

            {error ? <p className="register-error">{error}</p> : null}

            <button className="register-button" type="submit">Cadastrar</button>
            <button className="register-secondary-button" type="button" onClick={() => navigate('/login')}>
              Voltar para login
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default RegisterPage
