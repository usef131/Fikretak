import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { ideaService } from '../../../Services/ideaService'
import { useIdeas } from '../../../Context/IdeaContext'
import './Editidea.css'

const CATEGORIES = ['Tech', 'Health', 'Education', 'Finance', 'Environment', 'Social', 'Other']

export default function EditIdea() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { fetchMyIdeas } = useIdeas()

  const [roadmap, setRoadmap] = useState([{ period: '', title: '', desc: '' }])
  const [form, setForm] = useState({
    title: '', summary: '', description: '',
    category: '', targetMarket: '', fundingGoal: '', teamMembers: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [apiError, setApiError] = useState('')

  // Load existing idea
  useEffect(() => {
    const load = async () => {
      try {
        const data = await ideaService.getIdeaById(id)
        const idea = data.idea || data
        setForm({
          title:        idea.title        || '',
          summary:      idea.summary      || '',
          description:  idea.description  || '',
          category:     idea.category     || '',
          targetMarket: idea.targetMarket || '',
          fundingGoal:  idea.fundingGoal  || '',
          teamMembers:  idea.teamSize     || idea.teamMembers || '',
        })
        if (idea.roadmap?.length) setRoadmap(idea.roadmap)
        if (idea.image) setPreview(idea.image)
      } catch {
        setApiError('Failed to load idea')
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.title.trim())        e.title       = 'Title is required'
    if (form.title.length > 100)   e.title       = 'Title must be under 100 characters'
    if (!form.summary.trim())      e.summary     = 'Summary is required'
    if (form.summary.length > 300) e.summary     = 'Max 300 characters'
    if (!form.category)            e.category    = 'Please select a category'
    if (form.fundingGoal && isNaN(Number(form.fundingGoal))) e.fundingGoal = 'Enter a valid number'
    if (!form.teamMembers)         e.teamMembers = 'Team members is required'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onloadend = () => setImageFile(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      await ideaService.updateIdea(id, {
        ...form,
        ...(imageFile ? { image: imageFile } : {}),
        roadmap,
        fundingGoal: form.fundingGoal ? Number(form.fundingGoal) : undefined,
      })
      await fetchMyIdeas()
      navigate(`/browse-projects/${id}`, { replace: true, state: { refresh: true } })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const charCount = (field, max) => (
    <small className={`ei-char-count ${form[field].length > max ? 'over' : 'ok'}`}>
      {form[field].length}/{max}
    </small>
  )

  const addRoadmapItem    = () => setRoadmap(prev => [...prev, { period: '', title: '', desc: '' }])
  const removeRoadmapItem = (i) => setRoadmap(prev => prev.filter((_, idx) => idx !== i))
  const handleRoadmapChange = (i, field, value) =>
    setRoadmap(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  /* ── Loading ── */
  if (fetching) return (
    <div className="ei-loading d-flex justify-content-center align-items-center">
      <Spinner animation="border" className="ei-spinner" />
    </div>
  )

  return (
    <div className="ei-page">

      {/* ── Header ── */}
      <div className="ei-header">
        <Container>
          <h1 className="ei-header-title text-center">Edit Your Idea</h1>
          <p className="ei-header-sub text-center">
            Update the details below and save your changes.
          </p>
        </Container>
      </div>

      <Container className="ei-body">
        <Row className="justify-content-center">
          <Col lg={8}>

            {apiError && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setApiError('')}
                className="ei-alert"
              >
                {apiError}
              </Alert>
            )}

            <div className="fk-card p-4">
              <Form onSubmit={handleSubmit} noValidate>

                {/* Title */}
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="ei-label">
                      Idea Title <span className="text-danger">*</span>
                    </Form.Label>
                    {charCount('title', 100)}
                  </div>
                  <Form.Control
                    className="ei-control"
                    value={form.title}
                    onChange={handleChange('title')}
                    placeholder="e.g. AI-Powered Agricultural Water Management"
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-4">
                  <Form.Label className="ei-label-mb">
                    Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    className="ei-control"
                    value={form.category}
                    onChange={handleChange('category')}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                </Form.Group>

                {/* Summary */}
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="ei-label">
                      Short Summary <span className="text-danger">*</span>
                    </Form.Label>
                    {charCount('summary', 300)}
                  </div>
                  <Form.Control
                    as="textarea" rows={3}
                    className="ei-control-resize"
                    value={form.summary}
                    onChange={handleChange('summary')}
                    placeholder="A brief overview of your idea and the problem it solves"
                    isInvalid={!!errors.summary}
                  />
                  <Form.Control.Feedback type="invalid">{errors.summary}</Form.Control.Feedback>
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-4">
                  <Form.Label className="ei-label-mb">Full Description</Form.Label>
                  <Form.Control
                    as="textarea" rows={6}
                    className="ei-control-resize"
                    value={form.description}
                    onChange={handleChange('description')}
                    placeholder="Describe your idea in detail…"
                  />
                </Form.Group>

                {/* Target Market */}
                <Form.Group className="mb-4">
                  <Form.Label className="ei-label-mb">Target Market</Form.Label>
                  <Form.Control
                    className="ei-control"
                    value={form.targetMarket}
                    onChange={handleChange('targetMarket')}
                    placeholder="Who are your potential customers or users?"
                  />
                </Form.Group>

                {/* Team Members */}
                <Form.Group className="mb-3">
                  <Form.Label className="ei-label-mb">Team Members</Form.Label>
                  <Form.Control
                    type="number" min={1}
                    className="ei-control"
                    value={form.teamMembers}
                    onChange={handleChange('teamMembers')}
                    placeholder="e.g. 3"
                    isInvalid={!!errors.teamMembers}
                  />
                  <Form.Control.Feedback type="invalid">{errors.teamMembers}</Form.Control.Feedback>
                </Form.Group>

                {/* Funding Goal */}
                <Form.Group className="mb-5">
                  <Form.Label className="ei-label-mb">Funding Goal (USD)</Form.Label>
                  <Form.Control
                    type="number" min={0}
                    className="ei-control"
                    value={form.fundingGoal}
                    onChange={handleChange('fundingGoal')}
                    placeholder="e.g. 50000"
                    isInvalid={!!errors.fundingGoal}
                  />
                  <Form.Text className="ei-hint">Leave blank if not yet determined</Form.Text>
                  <Form.Control.Feedback type="invalid">{errors.fundingGoal}</Form.Control.Feedback>
                </Form.Group>

                {/* Roadmap */}
                <Form.Group className="mb-5">
                  <div className="d-flex justify-content-between align-items-center ei-roadmap-header">
                    <Form.Label className="ei-label">Project Roadmap</Form.Label>
                    <button type="button" className="ei-add-phase-btn" onClick={addRoadmapItem}>
                      + Add Phase
                    </button>
                  </div>

                  {roadmap.map((item, i) => (
                    <div key={i} className="ei-phase-card">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="ei-phase-label">Phase {i + 1}</span>
                        {roadmap.length > 1 && (
                          <button type="button" className="ei-remove-btn" onClick={() => removeRoadmapItem(i)}>
                            ✕ Remove
                          </button>
                        )}
                      </div>
                      <div className="row g-2">
                        <div className="col-4">
                          <Form.Control
                            className="ei-phase-input"
                            placeholder="Period (e.g. Q1 2025)"
                            value={item.period}
                            onChange={(e) => handleRoadmapChange(i, 'period', e.target.value)}
                          />
                        </div>
                        <div className="col-8">
                          <Form.Control
                            className="ei-phase-input"
                            placeholder="Phase title (e.g. MVP Launch)"
                            value={item.title}
                            onChange={(e) => handleRoadmapChange(i, 'title', e.target.value)}
                          />
                        </div>
                        <div className="col-12">
                          <Form.Control
                            as="textarea" rows={2}
                            className="ei-control-noresize"
                            placeholder="Description of this phase..."
                            value={item.desc}
                            onChange={(e) => handleRoadmapChange(i, 'desc', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Form.Group>

                {/* Image */}
                <Form.Group className="mb-5">
                  <Form.Label className="ei-label-mb">Idea Image</Form.Label>
                  <Form.Control
                    type="file" accept="image/*"
                    className="ei-control"
                    onChange={handleImageChange}
                  />
                  {preview && (
                    <img src={preview} alt="preview" className="ei-image-preview" />
                  )}
                </Form.Group>

                {/* Actions */}
                <div className="d-flex gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="btn-primary ei-submit-btn"
                  >
                    {loading ? <><Spinner size="sm" className="me-2" />Saving…</> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    className="ei-cancel-btn"
                  >
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