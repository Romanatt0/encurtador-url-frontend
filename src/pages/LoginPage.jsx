import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'

const BASE_URL = import.meta.env.VITE_API_URL

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      onLogin(data.access_token)
      navigate('/')
    } catch (error) {
      setError('Erro ao realizar login. Verifique suas credenciais.')
    }
  }

  return (
    <main>

        <header className="login-topbar">
          <div className="login-brand">
            <span className="login-brand-mark" aria-hidden="true"></span>
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
