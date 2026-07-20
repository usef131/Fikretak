import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { ideaService } from '../../../Services/ideaService'
import { useIdeas } from '../../../Context/IdeaContext'
import '../../assets/styles/CreateIdea.css'

const CATEGORIES = ['Tech', 'Health', 'Education', 'Finance', 'Environment', 'Social', 'Other']

export default function CreateIdea() {
  const navigate    = useNavigate()
  const { addIdea } = useIdeas()
  const [roadmap, setRoadmap] = useState([
  { period: '', title: '', desc: '' }
   ])
  const [form, setForm] = useState({
    title: '', summary: '', description: '',
    category: '', targetMarket: '', fundingGoal: '', teamMembers: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview,   setPreview]   = useState(null)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.title.trim())  e.title    = 'Title is required'
    if (form.title.length > 100) e.title = 'Title must be under 100 characters'
    if (!form.summary.trim()) e.summary = 'Summary is required'
    if (form.summary.length > 300) e.summary = 'Max 300 characters'
    if (!form.category)       e.category = 'Please select a category'
    if (form.fundingGoal && isNaN(Number(form.fundingGoal))) e.fundingGoal = 'Enter a valid number'
    if (!form.teamMembers.trim()) e.teamMembers = 'Team members is required'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  const errs = validate()
  if (Object.keys(errs).length) { setErrors(errs); return }
  setLoading(true); setApiError('')
  try {
    const data = await ideaService.createIdea({
      ...form,
      image: imageFile, roadmap,
      fundingGoal: form.fundingGoal ? Number(form.fundingGoal) : undefined,
    })
    addIdea(data.idea)
    navigate(`/browse-projects/${data.idea._id}`)
  } catch (err) {
    setApiError(err.message)
  } finally {
    setLoading(false)
  }
}

  const charCount = (field, max) => (
    <small className={form[field].length > max ? 'fk-charcount fk-charcount-danger' : 'fk-charcount fk-charcount-muted'}>
      {form[field].length}/{max}
    </small>
  )
  

  const addRoadmapItem = () =>
    setRoadmap(prev => [...prev, { period: '', title: '', desc: '' }])

  const removeRoadmapItem = (i) =>
    setRoadmap(prev => prev.filter((_, idx) => idx !== i))

  const handleRoadmapChange = (i, field, value) =>
  setRoadmap(prev => prev.map((item, idx) =>
    idx === i ? { ...item, [field]: value } : item
  ))

  return (
    <div className="fk-createidea-page">
      {/* Page header */}
      <div className="fk-createidea-header">
        <Container>
          <h1 className="fk-createidea-title text-center">Submit Your Idea</h1>
          <p className="fk-createidea-subtitle text-center">
            Fill in the details below. Our team will review and approve it before it goes public.
          </p>
        </Container>
      </div>

      <Container className="fk-createidea-container">
        <Row className="justify-content-center">
          <Col lg={8}>
            {apiError && (
              <Alert variant="danger" dismissible onClose={() => setApiError('')}
                className="fk-createidea-alert">
                {apiError}
              </Alert>
            )}

            <div className="fk-card p-4">
              <Form onSubmit={handleSubmit} noValidate>
                {/* Title */}
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="fk-createidea-label-nomargin">
                      Idea Title <span className="text-danger">*</span>
                    </Form.Label>
                    {charCount('title', 100)}
                  </div>
                  <Form.Control
                    value={form.title}
                    onChange={handleChange('title')}
                    placeholder="e.g. AI-Powered Agricultural Water Management"
                    isInvalid={!!errors.title}
                    className="fk-createidea-input"
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>
                {/* Category */}
                <Form.Group className="mb-4">
                  <Form.Label className="fk-createidea-label">
                    Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={form.category}
                    onChange={handleChange('category')}
                    isInvalid={!!errors.category}
                    className="fk-createidea-input" >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                </Form.Group>
                {/* Summary */}
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="fk-createidea-label-nomargin">
                      Short Summary <span className="text-danger">*</span>
                    </Form.Label>
                    {charCount('summary', 300)}
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.summary}
                    onChange={handleChange('summary')}
                    placeholder="A brief overview of your idea and the problem it solves"
                    isInvalid={!!errors.summary}
                    className="fk-createidea-textarea"/>
                  <Form.Control.Feedback type="invalid">{errors.summary}</Form.Control.Feedback>
                </Form.Group>
                {/* Description */}
                <Form.Group className="mb-4">
                  <Form.Label className="fk-createidea-label">Full Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={form.description}
                    onChange={handleChange('description')}
                    placeholder="Describe your idea in detail: the problem, your solution, how it works, business model…"
                    className="fk-createidea-textarea"/>
                </Form.Group>
                {/* Target Market */}
                <Form.Group className="mb-4">
                  <Form.Label className="fk-createidea-label">Target Market</Form.Label>
                  <Form.Control
                    value={form.targetMarket}
                    onChange={handleChange('targetMarket')}
                    placeholder="Who are your potential customers or users?"
                    className="fk-createidea-input"/>
                </Form.Group>
                {/* Team Members */}
                <Form.Group className="mb-3">
                  <Form.Label className="fk-createidea-label">Team Members</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.teamMembers}
                    onChange={handleChange('teamMembers')}
                    placeholder="e.g. 3"
                    isInvalid={!!errors.teamMembers}
                    min={1}
                    className="fk-createidea-input"/>
                  <Form.Control.Feedback type="invalid">{errors.teamMembers}</Form.Control.Feedback>
                </Form.Group>
                {/* Funding Goal */}
                <Form.Group className="mb-5">
                  <Form.Label className="fk-createidea-label">Funding Goal (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.fundingGoal}
                    onChange={handleChange('fundingGoal')}
                    placeholder="e.g. 50000"
                    isInvalid={!!errors.fundingGoal}
                    min={0}
                    className="fk-createidea-input"/>
                  <Form.Text className="fk-createidea-hint">
                    Leave blank if not yet determined
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">{errors.fundingGoal}</Form.Control.Feedback>
                </Form.Group>
                {/* Roadmap */}
                <Form.Group className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Label className="fk-createidea-label-nomargin">
                      Project Roadmap
                    </Form.Label>
                    <button type="button" onClick={addRoadmapItem}
                      className="fk-roadmap-addbtn">
                      + Add Phase
                    </button>
                  </div>
                  {roadmap.map((item, i) => (
                    <div key={i} className="fk-roadmap-item">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fk-roadmap-phase-label">Phase {i + 1}</span>
                        {roadmap.length > 1 && (
                          <button type="button" onClick={() => removeRoadmapItem(i)}
                            className="fk-roadmap-removebtn">
                            ✕ Remove
                          </button>)}
                      </div>
                      <div className="row g-2">
                        <div className="col-4">
                          <Form.Control
                            placeholder="Period (e.g. Q1 2025)"
                            value={item.period}
                            onChange={(e) => handleRoadmapChange(i, 'period', e.target.value)}
                            className="fk-roadmap-input"/>
                        </div>
                        <div className="col-8">
                          <Form.Control
                            placeholder="Phase title (e.g. MVP Launch)"
                            value={item.title}
                           onChange={(e) => handleRoadmapChange(i, 'title', e.target.value)}
                            className="fk-roadmap-input"/>
                        </div>
                        <div className="col-12">
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Description of this phase..."
                            value={item.desc}
                           onChange={(e) => handleRoadmapChange(i, 'desc', e.target.value)}
                            className="fk-roadmap-textarea"/>
                        </div>
                      </div>
                    </div>))}
                </Form.Group>
                 {/* Idea Image */}
                <Form.Group className="mb-5">
                  <Form.Label className="fk-createidea-label">Idea Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      setPreview(URL.createObjectURL(file))
                      const reader = new FileReader()
                      reader.onloadend = () => setImageFile(reader.result) // Base64
                      reader.readAsDataURL(file)
                    }}
                    className="fk-createidea-input"/>
                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="fk-createidea-preview"
                    />
                  )}
                </Form.Group>
                <div className="d-flex gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="btn-primary fk-createidea-submitbtn">
                    {loading ? <><Spinner size="sm" className="me-2" />Submitting…</> : 'Submit Idea'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate('/browse-projects')}
                    disabled={loading}
                    className="fk-createidea-cancelbtn">
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}