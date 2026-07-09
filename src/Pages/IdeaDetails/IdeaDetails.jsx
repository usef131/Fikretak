import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap'
import { ideaService } from '../../../Services/ideaService'
import { useAuth } from '../../../Context/AuthContext'
import InvestModal from '../../Components/Invest/Investmodal'
import '../../assets/styles/IdeaDetails.css'

export default function IdeaDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [interested, setInterested] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [showInvest, setShowInvest] = useState(false)

  useEffect(() => {
    setLoading(true)
    ideaService.getIdeaById(id)
      .then(data => {
        setIdea(data.idea)
        if (user) setInterested(
          data.idea.interestedInvestors?.some(
            inv => (inv._id || inv).toString() === user._id.toString()
          )
        )
      })
      .catch(() => setError('Idea not found or unavailable.'))
      .finally(() => setLoading(false))
  }, [id, user])

  const handleInterest = async () => {
    if (!user) return navigate('/login')
    if (user.role !== 'investor') return
    setActionLoading(true)
    try {
      if (interested) {
        await ideaService.withdrawInterest(id)
        setInterested(false)
        setIdea(prev => ({ ...prev, interestCount: prev.interestCount - 1 }))
      } else {
        await ideaService.expressInterest(id)
        setInterested(true)
        setIdea(prev => ({ ...prev, interestCount: prev.interestCount + 1 }))
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center idea-loading-wrapper">
      <Spinner animation="border" className="idea-loading-spinner" />
    </div>
  )

  if (error || !idea) return (
    <Container className="py-5">
      <Alert variant="danger">{error || 'Something went wrong.'}</Alert>
    </Container>
  )

  const fundingPct = idea.fundingGoal && idea.fundingRaised
    ? Math.min(100, Math.round((idea.fundingRaised / idea.fundingGoal) * 100))
    : idea.fundingProgress || 0

  return (
    <div className="idea-details-page">
      <Container className="idea-details-container">

        {/* Back */}
        <button className="back-btn" onClick={() => navigate('/browse-projects')}>
          ← Back to Projects
        </button>

        {/* Header */}
        <div className="idea-header">
          <div className="d-flex gap-2 mb-2">
            <span className="idea-category-badge">
              {idea.category}
            </span>
          </div>

          <h1 className="idea-title">
            {idea.title}
          </h1>

          <div className="idea-meta">
            <i className="bi bi-eye me-1" />{idea.views || 0} views &nbsp;•&nbsp;
            <i className="bi bi-heart me-1" />{idea.interestCount || 0} interested &nbsp;•&nbsp;
            <i className="bi bi-calendar3 me-1" />
            {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <Row className="g-4">

          {/* LEFT */}
          <Col lg={8}>

            {/* Image */}
            <div className="idea-image-wrapper">
              <img
                src={idea.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72'}
                alt={idea.title}
              />
            </div>

            {/* Mission */}
            <div className="fk-card p-4 mb-3">
              <h3 className="section-title">
                Project Mission
              </h3>
              <p className="section-text">
                {idea.mission || idea.description || idea.summary}
              </p>
            </div>

            {/* Target Market */}
            {idea.targetMarket && (
              <div className="fk-card p-4">
                <h3 className="section-title">
                  Target Market
                </h3>
                <p className="section-text">
                  {idea.targetMarket}
                </p>
              </div>
            )}
          </Col>

          {/* RIGHT */}
          <Col lg={4}>

            {/* Funding Card */}
            {idea.fundingGoal && (
              <div className="fk-card p-4 mb-4">
                <div className="funding-card-header">
                  <h4 className="funding-title">Funding</h4>
                  <span className="funding-pct">{fundingPct}%</span>
                </div>

                <div className="funding-goal-amount">
                  ${Number(idea.fundingGoal).toLocaleString()}
                </div>

                <div className="funding-raised-goal-row">
                  <span>Raised: ${Number(idea.fundingRaised || 0).toLocaleString()}</span>
                  <span>Goal: ${Number(idea.fundingGoal).toLocaleString()}</span>
                </div>

                <div className="funding-progress-track">
                  <div className="funding-progress-fill" style={{ width: `${fundingPct}%` }} />
                </div>

                {user?.role === 'investor' && (
                  <Button
                    className="btn-interest"
                    onClick={handleInterest}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Spinner size="sm" /> : interested ? (
                      <><i className="bi bi-heart-fill me-2" />Remove Interest</>
                    ) : (
                      <><i className="bi bi-heart me-2" />Express Interest</>
                    )}
                  </Button>
                )}

                {user?.role === 'investor' && (
                  <Button className="btn-invest" onClick={() => setShowInvest(true)}>
                    Invest
                  </Button>
                )}

                {!user && (
                  <Button className="btn-signin" href="/login">
                    Sign in to invest
                  </Button>
                )}
              </div>
            )}

            {/* Idea Creator */}
            <div className="fk-card p-4">
              <h6 className="creator-label">
                Idea Creator
              </h6>
              <div className="d-flex align-items-center gap-3">
                <div className="creator-avatar">
                  {idea.entrepreneur?.name?.[0] || '?'}
                </div>
                <div>
                  <div className="creator-name">{idea.entrepreneur?.name || 'Anonymous'}</div>
                  <div className="creator-role">Entrepreneur</div>
                </div>
              </div>
            </div>

          </Col>
        </Row>

        {/* Roadmap */}
        <div className="fk-card roadmap-card mt-4">

          <h2 className="roadmap-title">
            Project Roadmap
          </h2>

          <Row>
            {idea.roadmap.map((item, i) => (
              <Col key={i}>
                <div className="roadmap-item">
                  <h6 className="roadmap-period">
                    {item.period}
                  </h6>

                  <h5 className="roadmap-item-title">
                    {item.title}
                  </h5>

                  <p className="roadmap-desc">
                    {item.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>

        </div>

      </Container>
      <InvestModal show={showInvest} onHide={() => setShowInvest(false)} idea={idea} />
    </div>
  )
}
