import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useAuth } from '../../../Context/AuthContext'
import { ideaService } from '../../../Services/ideaService'
import IdeaCard from '../../Components/cards/IdeaCard'
import { useNavigate } from 'react-router-dom'
import { useIdeas } from '../../../Context/IdeaContext'
import SecondNavbar from '../../Components/Common/SecondNavbar'
import CreatePost from '../createPost/createPost'
import PostCard from '../../Components/Cards/postCard'
import { postService } from '../../../Services/postServices'
import "../../../src/styles/profile.css";


export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { myIdeas, myIdeasLoading, fetchMyIdeas } = useIdeas()
  const [interestedIdeas, setInterestedIdeas] = useState([])
  const [interestedLoading, setInterestedLoading] = useState(false)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    if (user?.role === 'entrepreneur') fetchMyIdeas()
    if (user?.role === 'investor') {
      setInterestedLoading(true)
      ideaService.getInterestedIdeas()
        .then(d => setInterestedIdeas(d.ideas || []))
        .catch(() => { })
        .finally(() => setInterestedLoading(false))
    }
  }, [user?._id])

  useEffect(() => {
    postService.getMyPosts().then(d => setPosts(d.posts || []))
  }, [])

  const handlePostCreated = (newPost) =>
    setPosts(prev => [newPost, ...prev])

  const handlePostDeleted = (postId) =>
    setPosts(prev => prev.filter(p => p._id !== postId))

  const initials =
    user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <>
      <SecondNavbar />

      <div style={{ background: 'var(--fk-bg)', minHeight: '100vh' }}>
        <Container style={{ paddingTop: '2rem', paddingBottom: '2rem', width: '50%' }}>

          {/* ── Profile Card ── */}
          <div className="fk-card p-4 mb-4" style={{ position: 'relative' }}>
            <div style={{ height: 80, borderRadius: 'var(--radius-md) var(--radius-md) 0 0', margin: '-1rem -1rem 0' }} />

            <div style={{ marginTop: '-40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div className="fk-avatar" style={{ width: 120, height: 120, fontSize: '3rem', border: '4px solid var(--fk-surface)' }}>
                {initials}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <button
                  onClick={() => navigate('/edit-profile')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--fk-border)',
                    background: 'var(--fk-surface)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <i className="bi bi-gear" /> Edit Profile
                </button>
              </div>
            </div>

            <div style={{ paddingBottom: 4 }}>
              {/* Name */}
              <h1 style={{ fontWeight: 800, fontSize: '1.25rem', marginLeft: '1rem', marginBottom: '0.25rem', marginTop: '0.5rem', color: 'var(--fk-text-primary)' }}>
                {user?.name}
              </h1>

              {/* Role badge */}
              <span style={{
                marginLeft: '1rem',
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.72rem', fontWeight: 600,
                background: user?.role === 'investor' ? '#fef3c7' : '#eef0ff',
                color: user?.role === 'investor' ? '#92400e' : 'var(--fk-primary-btn)',
                textTransform: 'capitalize',
              }}>
                {user?.role}
              </span>

              {/* Location */}
              {user?.location && (
                <span style={{ marginLeft: 10, fontSize: '0.78rem', color: 'var(--fk-text-muted)' }}>
                  <i className="bi bi-geo-alt" /> {user.location}
                </span>
              )}

              <br />

              {/* Bio */}
              {user?.bio && (
                <span style={{ marginLeft: '1rem', fontWeight: 500, fontSize: '1rem', color: 'var(--fk-text-primary)', display: 'inline-block', marginTop: '0.5rem' }}>
                  {user.bio}
                </span>
              )}

              {/* Investor extras */}
              {user?.role === 'investor' && (
                <>
                  {user?.sectors?.length > 0 && (
                    <div style={{ marginLeft: '1rem', marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {user.sectors.map(s => (
                        <span key={s} style={{
                          fontSize: '0.72rem', fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-pill)',
                          border: '1px solid var(--fk-border)',
                          color: 'var(--fk-text-muted)',
                          background: 'var(--fk-bg)',
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {user?.ticketSize && (
                    <p style={{ marginLeft: '1rem', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--fk-text-muted)' }}>
                      <i className="bi bi-cash-coin" /> Ticket size: <strong style={{ color: 'var(--fk-text-primary)' }}>{user.ticketSize}</strong>
                    </p>
                  )}
                  {user?.experience && (
                    <p style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.82rem', color: 'var(--fk-text-muted)' }}>
                      <i className="bi bi-briefcase" /> {user.experience}
                    </p>
                  )}
                </>
              )}

              {/* Entrepreneur extras */}
              {user?.role === 'entrepreneur' && (
                <>
                  {user?.startup && (
                    <p style={{ marginLeft: '1rem', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--fk-text-muted)' }}>
                      <i className="bi bi-rocket" /> {user.startup}
                      {user?.stage && (
                        <span style={{
                          marginLeft: 8,
                          padding: '1px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.72rem', fontWeight: 600,
                          background: '#eef0ff',
                          color: 'var(--fk-primary-btn)',
                          textTransform: 'capitalize',
                        }}>
                          {user.stage}
                        </span>
                      )}
                    </p>
                  )}
                  {user?.website && (
                    <p style={{ marginLeft: '1rem', marginTop: '0.25rem', fontSize: '0.82rem', color: 'var(--fk-text-muted)' }}>
                      <i className="bi bi-globe" />{' '}
                      <a href={user.website} target="_blank" rel="noreferrer" style={{ color: 'var(--fk-primary-btn)' }}>
                        {user.website}
                      </a>
                    </p>
                  )}
                </>
              )}

              {/* LinkedIn — both roles */}
              {user?.linkedin && (
                <div className="profile-social">
                  <span className="profile-social-label">
                    <i className="bi bi-linkedin"></i>
                    LinkedIn
                  </span>

                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-social-link"
                  >
                    View Profile
                    <i className="bi bi-arrow-up-right"></i>
                  </a>
                </div>
              )}

            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="row justify-content-center gap-3 mb-4" style={{ fontSize: '0.875rem' }}>
            <div className="col text-center">
              <div className="fk-card h-100 p-4 d-flex flex-column" style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--fk-text-primary)' }}>
                {user?.role === 'investor' ? interestedIdeas.length : myIdeas.length}
                <div style={{ color: 'var(--fk-text-muted)', fontSize: '0.78rem' }}>
                  {user?.role === 'investor' ? 'Interested' : 'Ideas'}
                </div>
              </div>
            </div>
            <div className="col text-center">
              <div className="fk-card h-100 p-4 d-flex flex-column" style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--fk-text-primary)' }}>
                0
                <div style={{ color: 'var(--fk-text-muted)', fontSize: '0.78rem' }}>Followers</div>
              </div>
            </div>
            <div className="col text-center">
              <div className="fk-card h-100 p-4 d-flex flex-column" style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--fk-text-primary)' }}>
                {posts.length}
                <div style={{ color: 'var(--fk-text-muted)', fontSize: '0.78rem' }}>Posts</div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <Tabs defaultActiveKey="ideas" className="mb-3" style={{ fontSize: '0.875rem', fontWeight: 600 }}>

            {user?.role === 'entrepreneur' && (
              <Tab eventKey="ideas" title={`My Ideas (${myIdeas.length})`}>
                <div className="mt-3">
                  {myIdeasLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" style={{ color: 'var(--fk-primary-btn)' }} />
                    </div>
                  ) : myIdeas.length > 0 ? (
                    <Row className="g-3">
                      {myIdeas.map(idea => (
                        <Col key={idea._id} xs={12}><IdeaCard idea={idea} /></Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-lightbulb" style={{ fontSize: '2.5rem', color: 'var(--fk-border)' }} />
                      <p className="mt-3" style={{ color: 'var(--fk-text-muted)', fontSize: '0.875rem' }}>
                        You haven't submitted any ideas yet.{' '}
                        <span style={{ color: 'var(--fk-primary-btn)', cursor: 'pointer', fontWeight: 600 }}
                          onClick={() => navigate('/create-idea')}>
                          Submit one now
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </Tab>
            )}

            {/* Posts tab */}
            <Tab eventKey="posts" title={`Posts (${posts.length})`}>
              <div className="mt-3">
                <CreatePost onPostCreated={handlePostCreated} />
                {posts.map(post => (
                  <PostCard key={post._id} post={post} onDelete={handlePostDeleted} />
                ))}
              </div>
            </Tab>

            {user?.role === 'investor' && (
              <Tab eventKey="interested" title={`Interested Ideas (${interestedIdeas.length})`}>
                <div className="mt-3">
                  {interestedLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" style={{ color: 'var(--fk-primary-btn)' }} />
                    </div>
                  ) : interestedIdeas.length > 0 ? (
                    <Row className="g-3">
                      {interestedIdeas.map(idea => (
                        <Col key={idea._id} xs={12}><IdeaCard idea={idea} /></Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-heart" style={{ fontSize: '2.5rem', color: 'var(--fk-border)' }} />
                      <p className="mt-3" style={{ color: 'var(--fk-text-muted)', fontSize: '0.875rem' }}>
                        You haven't expressed interest in any ideas yet.{' '}
                        <span style={{ color: 'var(--fk-primary-btn)', cursor: 'pointer', fontWeight: 600 }}
                          onClick={() => navigate('/Browse-projects')}>
                          Browse the projects
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </Tab>
            )}

          </Tabs>

        </Container>
      </div>
    </>
  )
}