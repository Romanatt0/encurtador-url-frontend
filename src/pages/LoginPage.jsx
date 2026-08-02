import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
import { FiMenu, FiUser, FiTrendingUp, FiCreditCard } from "react-icons/fi";
import { SiLangchain } from "react-icons/si";

const BASE_URL = import.meta.env.VITE_API_URL

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
  
    if (!response.ok) {
      throw new Error('Erro ao realizar login')
    }
  
    return await response.json()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    try {
      const data = await login(email, password)
      await onLogin(data.access_token, data.refresh_token, data.user)
      navigate('/')
    } catch (error) {
      setError('Erro ao realizar login. Verifique suas credenciais.')
    }
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
      <div className="login-page">

        <section className="login-section">

          <form className="login-form" onSubmit={handleSubmit}>

            <p className="login-form-label">Realize seu Login aqui:</p>

            <label htmlFor="email-input">Email:</label>
            <input type="email" id="email-input" placeholder="Digite seu e-mail" value={email} onChange={(event) => setEmail(event.target.value)}
            />

            <label htmlFor="password-input">Senha:</label>
            <input type="password" id="password-input" placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)}   
            />

            {error && <p className="login-form-error">{error}</p>}

            <button className="login-button" type="submit">Entrar</button>
            <button className="login-button" type="button" onClick={() => navigate('/register')}>Cadastrar</button>
          </form>
        </section>


        
      </div>
    </main>
  )
}

export default LoginPage
