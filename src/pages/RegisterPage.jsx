import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/register.css'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

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

  return (
    <main>
      <header className="register-topbar">
        <div className="register-brand">
          <span className="register-brand-mark" aria-hidden="true"></span>
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
