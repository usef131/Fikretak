import { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../Context/AuthContext'
import { authService } from '../../../Services/authService'
import { uploadService } from '../../../Services/uploadService'
import { FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import SecondNavbar from '../../Components/Common/SecondNavbar'
import '../../assets/styles/Editprofile.css'

const SECTOR_OPTIONS = ['Fintech', 'EdTech', 'AgriTech', 'HealthTech', 'CleanEnergy', 'E-commerce', 'Logistics', 'SaaS']
const STAGE_OPTIONS  = ['idea', 'mvp', 'growth', 'scaling']

export default function EditProfile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:       user?.name       || '',
    avatar:     user?.avatar     || '',
    bio:        user?.bio        || '',
    location:   user?.location   || '',
    linkedin:   user?.linkedin   || '',
    // investor-only
    sectors:    user?.sectors    || [],
    ticketSize: user?.ticketSize || '',
    experience: user?.experience || '',
    // entrepreneur-only
    startup:    user?.startup    || '',
    stage:      user?.stage      || '',
    website:    user?.website    || '',
  })

  const [saving,        setSaving]        = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [saveError,     setSaveError]     = useState('')
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')
  const [avatarUploading, setAvatarUploading] = useState(false)

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarUploading(true)
    setSaveError('')
    try {
      const { url } = await uploadService.uploadImage(file)
      set('avatar', url)
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Image upload failed')
    } finally {
      setAvatarUploading(false)
    }
  }

  const toggleSector = (s) => {
    set('sectors', form.sectors.includes(s)
      ? form.sectors.filter(x => x !== s)
      : [...form.sectors, s]
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setSaved(false); setSaveError('')
    try {
      const data = await authService.updateProfile(form)
      updateUser(data.user)
      setSaved(true)
      setTimeout(() => { setSaved(false); navigate('/profile') }, 1500)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const labelStyle = { fontWeight: 600, fontSize: '0.875rem' }
  const inputStyle = { borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }

  return (
    <>
      <SecondNavbar />

      <div className="edit-profile-page">
        <Container className="edit-profile-container">
          {/* Back */}
          <button onClick={() => navigate('/profile')}className="back-btn">
            <FiArrowLeft size={16} /> Back to Profile
          </button>
          <h2 className="edit-profile-title">
            Edit Profile
          </h2>
          <Row>
            <Col md={10}>
              {saved     && <Alert variant="success" className="edit-profile-alert">Profile updated! Redirecting…</Alert>}
              {saveError && <Alert variant="danger"  className="edit-profile-alert">{saveError}</Alert>}
              <div className="fk-card p-4">
                <Form onSubmit={handleSave}>
                  {/* ── Shared fields ── */}
                  <p className="section-label">
                    Basic Info
                  </p>

                  {/* Avatar */}
                  <Form.Group className="mb-3">
                    <Form.Label className="field-label">Profile Photo</Form.Label>
                    <div className="edit-avatar-row">
                      <div className="edit-avatar-preview">
                        {avatarPreview
                          ? <img src={avatarPreview} alt="avatar preview" />
                          : <span>{initials}</span>}
                      </div>
                      <div>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={avatarUploading}
                          className="field-input"
                        />
                        <Form.Text className="field-hint--no-indent">
                          {avatarUploading ? 'Uploading…' : 'PNG, JPG or WEBP, up to 5 MB'}
                        </Form.Text>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="field-label">Full Name</Form.Label>
                    <Form.Control value={form.name || ''} onChange={e => set('name', e.target.value)} className="field-input"/>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="field-label">Email</Form.Label>
                    <Form.Control value={user?.email || ''} disabled className="field-input field-input--disabled" />
                    <Form.Text  className="field-hint">
                         Email cannot be changed
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="field-label">Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} value={form.bio || ''}onChange={e => set('bio', e.target.value)} placeholder="Tell others a little about yourself…" className="field-input field-input--textarea"/>
                  </Form.Group>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="field-label">Location</Form.Label>
                        <Form.Control value={form.location || ''} onChange={e => set('location', e.target.value)} placeholder="Cairo, Egypt" className="field-input"/>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="field-label">LinkedIn URL</Form.Label>
                        <Form.Control value={form.linkedin || ''} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/yourname" className="field-input"/>
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="section-divider"/>

                  {/* ── Investor-only fields ── */}
                  {user?.role === 'investor' && (
                    <>
                      <p className="section-label">                   
                         Investor Info
                      </p>

                      <Form.Group className="mb-3">
                        <Form.Label className="field-label">Investment Sectors</Form.Label>
                        <div className="sector-options">
                          {SECTOR_OPTIONS.map(s => (
                            <button key={s} type="button" onClick={() => toggleSector(s)}className={`sector-pill ${form.sectors.includes(s) ? 'sector-pill--active' : ''}`} >
                              {s}
                            </button>
                          ))}
                        </div>
                        <Form.Text className="field-hint--no-indent">
                          Select all that apply
                        </Form.Text>
                      </Form.Group>

                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="field-label">Ticket Size</Form.Label>
                            <Form.Control value={form.ticketSize || ''} onChange={e => set('ticketSize', e.target.value)} placeholder="e.g. $50K – $200K" className="field-input" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="field-label">Experience</Form.Label>
                            <Form.Control value={form.experience || ''} onChange={e => set('experience', e.target.value)} placeholder="e.g. 10+ years in VC" className="field-input" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* ── Entrepreneur-only fields ── */}
                  {user?.role === 'entrepreneur' && (
                    <>
                      <p className="section-label">
                        Startup Info
                      </p>

                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="field-label">Startup Name</Form.Label>
                            <Form.Control value={form.startup || ''} onChange={e => set('startup', e.target.value)} placeholder="Your startup name" className="field-input"/>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="field-label">Stage</Form.Label>
                            <Form.Select value={form.stage} onChange={e => set('stage', e.target.value)} className="field-input">
                              <option value="">Select stage…</option>
                              {STAGE_OPTIONS.map(s => (
                                <option key={s} value={s} className="stage-option">{s}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label className="field-label">Website</Form.Label>
                        <Form.Control value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourstartup.com" className="field-input"/>
                      </Form.Group>
                    </>
                  )}

                  {/* ── Actions ── */}
                 <div className="d-flex form-actions">
                    <Button type="submit" disabled={saving} className="btn-primary  action-btn">
                      {saving ? <Spinner size="sm" /> : 'Save Changes'}
                    </Button>

                    <Button type="button" variant="secondary" onClick={() => navigate('/profile')} className="action-btn">
                      Cancel
                    </Button>
                  </div>

                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}