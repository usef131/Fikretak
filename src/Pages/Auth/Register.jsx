import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../Context/AuthContext'
import PageTransition from '../HomePageTwo/PageTransition'

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
    setLoading(true); setApiError('')
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password, role: form.role })
      navigate('/Home-two')
    } catch (e) {
      setApiError(e.message)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--fk-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: step === 2 ? 620 : 420 }}>
        {/* Brand */}
        <div className="text-center mb-5">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--fk-text-primary)', letterSpacing: '-0.5px' }}>
              Fikretak
            </span>
          </Link>
        </div>

        {/* ── STEP 1: Account Details ── */}
        {step === 1 && (
          <>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', textAlign: 'center', marginBottom: '0.25rem' }}>
              Create your account
            </h2>
            <p style={{ color: 'var(--fk-text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.75rem' }}>
              Join Fikretak and start your journey
            </p>

            <div className="fk-card p-4">
              {apiError && (
                <Alert variant="danger" dismissible onClose={() => setApiError('')} style={{ fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleNext} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Full Name</Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
                    placeholder="Your full name"
                    isInvalid={!!errors.name}
                    style={{ borderRadius: 'var(--radius-sm)', padding: '0.65rem 1rem', fontSize: '0.9rem' }}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                    placeholder="you@example.com"
                    isInvalid={!!errors.email}
                    style={{ borderRadius: 'var(--radius-sm)', padding: '0.65rem 1rem', fontSize: '0.9rem' }}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })) }}
                    placeholder="Min. 6 characters"
                    isInvalid={!!errors.password}
                    style={{ borderRadius: 'var(--radius-sm)', padding: '0.65rem 1rem', fontSize: '0.9rem' }}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => { setForm(p => ({ ...p, confirmPassword: e.target.value })); setErrors(p => ({ ...p, confirmPassword: '' })) }}
                    placeholder="Repeat your password"
                    isInvalid={!!errors.confirmPassword}
                    style={{ borderRadius: 'var(--radius-sm)', padding: '0.65rem 1rem', fontSize: '0.9rem' }}
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 btn-primary"
                  size="lg"
                  style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}
                >
                  Continue <i className="bi bi-arrow-right ms-1" />
                </Button>
              </Form>

              
            </div>
          </>
        )}

        <p className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--fk-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--fk-primary-btn)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>

        {/* ── STEP 2: Role Selection (matches screenshot 6) ── */}
        
       
        {step === 2 && (
             <PageTransition> 

          <div>
            {/* Step indicator */}
            <div className="text-center mb-2">
              <span style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--fk-border)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--fk-text-secondary)',
                marginBottom: '1rem',
              }}>
                Step 2 of 3
              </span>
              
            </div>
            

            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.35rem' }}>
              Tell us about yourself
            </h2>
            <p style={{ color: 'var(--fk-text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
              Select one or more roles that best describe you
            </p>

            {apiError && (
              <Alert variant="danger" style={{ fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                {apiError}
              </Alert>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.5rem' }}>
              {ROLES.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, role: opt.value })); setErrors(p => ({ ...p, role: '' })) }}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid',
                    borderColor: form.role === opt.value ? opt.color : 'var(--fk-border)',
                    background: form.role === opt.value ? opt.bg : 'var(--fk-surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: 10,
                    background: form.role === opt.value ? opt.color : '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: form.role === opt.value ? '#fff' : '#9ca3af',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}>
                    <i className={`bi ${opt.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--fk-text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--fk-text-muted)', lineHeight: 1.4 }}>{opt.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {errors.role && (
              <p style={{ color: 'var(--fk-danger)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>{errors.role}</p>
            )}

            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={loading || !form.role}
                size="lg"
                className="btn-primary"
                style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700, padding: '0.7rem 2.5rem', opacity: form.role ? 1 : 0.6 }}
              >
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-arrow-right me-1" />Continue</>}
              </Button>
              <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--fk-text-muted)' }}>
                You can update your roles anytime in settings
              </p>
            </div>
          </div>
      </PageTransition>
        
        )}
      </div>
    </div >
              

    )
}
