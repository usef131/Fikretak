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
import '../../assets/styles/Profile.css';


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

      <div className="profile-page">
        <Container className="profile-container">

          {/* ── Profile Card ── */}
          <div className="fk-card p-4 mb-4 profile-card">
            <div className="profile-card-banner" />

            <div className="profile-card-header">
              <div className="fk-avatar profile-avatar">
                {initials}
              </div>
              <div className="profile-header-actions">
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="edit-profile-btn"
                >
                  <i className="bi bi-gear" /> Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-body">
              {/* Name */}
              <h1 className="profile-name">
                {user?.name}
              </h1>

              {/* Role badge */}
              <span className={`profile-role-badge ${user?.role === 'investor' ? 'profile-role-badge--investor' : 'profile-role-badge--entrepreneur'}`}>
                {user?.role}
              </span>

              {/* Location */}
              {user?.location && (
                <span className="profile-location">
                  <i className="bi bi-geo-alt" /> {user.location}
                </span>
              )}

              <br />

              {/* Bio */}
              {user?.bio && (
                <span className="profile-bio">
                  {user.bio}
                </span>
              )}

              {/* Investor extras */}
              {user?.role === 'investor' && (
                <>
                  {user?.sectors?.length > 0 && (
                    <div className="profile-sectors">
                      {user.sectors.map(s => (
                        <span key={s} className="profile-sector-chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {user?.ticketSize && (
                    <p className="profile-meta-line">
                      <i className="bi bi-cash-coin" /> Ticket size: <strong className="profile-meta-strong">{user.ticketSize}</strong>
                    </p>
                  )}
                  {user?.experience && (
                    <p className="profile-meta-line--tight">
                      <i className="bi bi-briefcase" /> {user.experience}
                    </p>
                  )}
                </>
              )}

              {/* Entrepreneur extras */}
              {user?.role === 'entrepreneur' && (
                <>
                  {user?.startup && (
                    <p className="profile-meta-line">
                      <i className="bi bi-rocket" /> {user.startup}
                      {user?.stage && (
                        <span className="profile-stage-badge">
                          {user.stage}
                        </span>
                      )}
                    </p>
                  )}
                  {user?.website && (
                    <p className="profile-meta-line--tight">
                      <i className="bi bi-globe" />{' '}
                      <a href={user.website} target="_blank" rel="noreferrer" className="profile-website-link">
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
          <div className="row justify-content-center gap-3 mb-4 profile-stats-row">
            <div className="col text-center">
              <div className="fk-card h-100 p-4 d-flex flex-column profile-stat-value">
                {user?.role === 'investor' ? interestedIdeas.length : myIdeas.length}
                <div className="profile-stat-label">
                  {user?.role === 'investor' ? 'Interested' : 'Ideas'}
                </div>
              </div>
            </div>
            <div className="col text-center">
              <div className="fk-card h-100 p-4 d-flex flex-column profile-stat-value">
                0
                <div className="profile-stat-label">Followers</div>
              </div>
            </div>
            <div className="col text-center">
              <div className="fk-card h-100 p-4 d-flex flex-column profile-stat-value">
                {posts.length}
                <div className="profile-stat-label">Posts</div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <Tabs defaultActiveKey="ideas" className="mb-3 profile-tabs">

            {user?.role === 'entrepreneur' && (
              <Tab eventKey="ideas" title={`My Ideas (${myIdeas.length})`}>
                <div className="mt-3">
                  {myIdeasLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" className="profile-spinner" />
                    </div>
                  ) : myIdeas.length > 0 ? (
                    <Row className="g-3">
                      {myIdeas.map(idea => (
                        <Col key={idea._id} xs={12}><IdeaCard idea={idea} /></Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-lightbulb profile-empty-icon" />
                      <p className="mt-3 profile-empty-text">
                        You haven't submitted any ideas yet.{' '}
                        <span className="profile-empty-link"
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
                      <Spinner animation="border" className="profile-spinner" />
                    </div>
                  ) : interestedIdeas.length > 0 ? (
                    <Row className="g-3">
                      {interestedIdeas.map(idea => (
                        <Col key={idea._id} xs={12}><IdeaCard idea={idea} /></Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-heart profile-empty-icon" />
                      <p className="mt-3 profile-empty-text">
                        You haven't expressed interest in any ideas yet.{' '}
                        <span className="profile-empty-link"
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
