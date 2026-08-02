import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LinksPage from './pages/LinksPage'
import ComingSoonPage from './pages/ComingSoonPage'

const BASE_URL = import.meta.env.VITE_API_URL

function App() {

  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("access_token")
  )

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  const isAuthenticated = user !== null

  // Login realizado com sucesso
  const handleLogin = async (accessToken, refreshToken, user) => {
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)

    setAccessToken(accessToken)

    if (!user) {
      user = await userVerification(accessToken)
    }

    setUser(user)
    sessionStorage.setItem("user", JSON.stringify(user))
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setAccessToken(null)
    setUser(null)
    sessionStorage.removeItem("user")
  }

  // Renova o access token
  const authenticate = async (refreshToken) => {
    const response = await fetch(`${BASE_URL}/user/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error("Refresh token inválido")
    }

    return response.json()
  }

  // Verifica o usuário autenticado
  const userVerification = async (accessToken) => {
    const response = await fetch(`${BASE_URL}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Access token inválido")
    }

    return response.json()
  }

  useEffect(() => {

    const autoLogin = async () => {

      try {

        let token = localStorage.getItem("access_token")

        // Existe access token
        if (token) {

          const userData = await userVerification(token)

          setAccessToken(token)
          setUser(userData)
          sessionStorage.setItem("user", JSON.stringify(userData))

          return
        }

        // Não existe access token
        const refreshToken = localStorage.getItem("refresh_token")

        if (!refreshToken) {
          return
        }

        // Renova o access token
        const refreshData = await authenticate(refreshToken)

        token = refreshData.access_token

        localStorage.setItem("access_token", token)

        setAccessToken(token)

        // Agora valida o novo token
        const userData = await userVerification(token)

        setUser(userData)
        sessionStorage.setItem("user", JSON.stringify(userData))

      } catch (error) {

        console.error(error)

        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")

        setAccessToken(null)
        setUser(null)

      } finally {

        setLoading(false)

      }

    }

    autoLogin()

  }, [])

  if (loading) {
    return <h2>Carregando...</h2>
  }

  return (
    <Routes>

      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/" replace />
            : <LoginPage onLogin={handleLogin} />
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to="/" replace />
            : <RegisterPage />
        }
      />

      <Route
        path="/"
        element={<HomePage onLogout={handleLogout} user={user}
      setUser={setUser}/>}
      />

      <Route
        path="/links"
        element={
          isAuthenticated
            ? <LinksPage onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/coming-soon"
        element={<ComingSoonPage onLogout={handleLogout} user={user}
      setUser={setUser}/>}
      />

    </Routes>
  )
}

export default App