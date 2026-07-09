import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../Context/AuthContext'
import '../../assets/styles/Login.css'

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname || '/'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setApiError('')
    try {
      await login(form.email, form.password)
      navigate("/home-two" , { replace: true })
    } catch (e) {
      setApiError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fk-login-page">
      <div className="fk-login-box">
        {/* Brand */}
        <div className="text-center mb-5">
          <Link to="/" className="fk-login-brand-link">
            <span className="fk-login-brand">
              Fikretak
            </span>
          </Link>
          <h2 className="fk-login-title">
            Welcome back!
          </h2>
          <p className="fk-login-subtitle">
            Sign in to continue sharing ideas
          </p>
        </div>

        <div className="fk-card p-4">
          {apiError && (
            <Alert variant="danger" dismissible onClose={() => setApiError('')} className="fk-login-alert">
              {apiError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label className="fk-login-label">Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                isInvalid={!!errors.email}
                className="fk-login-input"
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="fk-login-label">Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                isInvalid={!!errors.password}
                className="fk-login-input"
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <div className="text-end mb-4">
              <Link to="/forgot-password" className="fk-login-forgot-link">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-100 btn-primary fk-login-submitbtn"
              size="lg"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Sign In'}
            </Button>
          </Form>

       

          
        </div>

        <p className="text-center mt-4 fk-login-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="fk-login-signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}