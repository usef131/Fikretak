import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../Context/AuthContext'
import PageTransition from '../HomePageTwo/PageTransition'
import '../../assets/styles/Register.css'

const ROLES = [
  { value: 'entrepreneur', icon: 'bi-graph-up-arrow', label: 'Entrepreneur', sub: 'Launch and grow businesses', color: '#a855f7', bg: '#f3e8ff' },
  { value: 'investor', icon: 'bi-graph-up-arrow', label: 'Investor', sub: 'Fund promising ideas', color: '#10b981', bg: '#d1fae5' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const setField = (field, value) => {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(p => ({ ...p, [field]: '' }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleNext = (ev) => {
    ev.preventDefault()
    const errs = validateStep1()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!form.role) { setErrors({ role: 'Please select your role' }); return }
    setLoading(true)
    setApiError('')
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role })
      navigate('/home-two')
    } catch (e) {
      setApiError(e.message)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reg-page">
      <div className={`reg-inner ${step === 2 ? 'step-2' : 'step-1'}`}>

        {/* ── Brand ── */}
        <div className="text-center mb-5">
          <Link to="/" className="reg-brand">
            <span className="reg-brand-text">Fikretak</span>
          </Link>
        </div>

        {/* ── Step 1: Account Details ── */}
        {step === 1 && (
          <>
            <h2 className="reg-title">Create your account</h2>
            <p className="reg-subtitle">Join Fikretak and start your journey</p>

            <div className="fk-card p-4">
              {apiError && (
                <Alert variant="danger" dismissible onClose={() => setApiError('')} className="reg-alert">
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleNext} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label className="reg-label">Full Name</Form.Label>
                  <Form.Control
                    className="reg-control"
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                    placeholder="Your full name"
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="reg-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    className="reg-control"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    placeholder="you@example.com"
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="reg-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="reg-control"
                    value={form.password}
                    onChange={e => setField('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="reg-label">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    className="reg-control"
                    value={form.confirmPassword}
                    onChange={e => setField('confirmPassword', e.target.value)}
                    placeholder="Repeat your password"
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className="w-100 btn-primary reg-submit-btn" size="lg">
                  Continue <i className="bi bi-arrow-right ms-1" />
                </Button>
              </Form>
            </div>
          </>
        )}

        <p className="text-center mt-4 reg-signin-text">
          Already have an account?{' '}
          <Link to="/login" className="reg-signin-link">Sign in</Link>
        </p>

        {/* ── Step 2: Role Selection ── */}
        {step === 2 && (
          <PageTransition>
            <div>
              {/* Step indicator */}
              <div className="text-center mb-2">
                <span className="reg-step-badge">Step 2 of 2</span>
              </div>

              <h2 className="reg-s2-title">Tell us about yourself</h2>
              <p className="reg-s2-sub">Select the role that best describes you</p>

              {apiError && (
                <Alert variant="danger" className="reg-alert mb-3">{apiError}</Alert>
              )}

              {/* Role cards */}
              <div className="reg-role-grid">
                {ROLES.map(opt => {
                  const selected = form.role === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className="reg-role-btn"
                      onClick={() => setField('role', opt.value)}
                      style={{
                        borderColor: selected ? opt.color : undefined,
                        background: selected ? opt.bg : undefined,
                      }}
                    >
                      <div
                        className={`reg-role-icon ${selected ? 'active' : ''}`}
                        style={{ background: selected ? opt.color : undefined }}
                      >
                        <i className={`bi ${opt.icon}`} />
                      </div>
                      <div>
                        <div className="reg-role-label">{opt.label}</div>
                        <div className="reg-role-sub">{opt.sub}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {errors.role && <p className="reg-role-error">{errors.role}</p>}

              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !form.role}
                  size="lg"
                  className={`btn-primary reg-continue-btn ${!form.role ? 'disabled' : ''}`}
                >
                  {loading
                    ? <Spinner size="sm" />
                    : <><i className="bi bi-arrow-right me-1" />Continue</>
                  }
                </Button>
                <p className="reg-hint">You can update your roles anytime in settings</p>
              </div>
            </div>
          </PageTransition>
        )}

      </div>
    </div>
  )
}