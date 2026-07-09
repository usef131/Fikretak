import { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext'
import IdeaCard from '../../Components/cards/IdeaCard'
import SecondNavbar from '../../Components/Common/SecondNavbar'
import '../../assets/styles/ViewProfile.css'
import investorService from '../../../Services/investorServices'


export default function ViewProfile() {
    const { id } = useParams()
    const { user: currentUser } = useAuth()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [profileLoading, setProfileLoading] = useState(true)
    const [ideas, setIdeas] = useState([])
    const [ideasLoading, setIdeasLoading] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [id])

    const fetchProfile = async () => {
        try {
            setProfileLoading(true)
            const res = await investorService.getUserById(id)
            const data = res.user || res
            setProfile(data)

            if (data.role === 'investor') {
                setIdeasLoading(true)
                const ideasRes = await investorService.getIdeasInterestedByUser(id)
                setIdeas(ideasRes.ideas || [])
                setIdeasLoading(false)
            } else if (data.role === 'entrepreneur') {
                setIdeasLoading(true)
                const ideasRes = await investorService.getIdeasByUser(id)
                setIdeas(ideasRes.ideas || [])
                setIdeasLoading(false)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setProfileLoading(false)
        }
    }

    const handleFollow = () => setIsFollowing(prev => !prev)

    /* ── Loading ── */
    if (profileLoading) {
        return (
            <>
                <SecondNavbar />
                <div className="vp-center-state">
                    <Spinner animation="border" className="vp-spinner" />
                </div>
            </>
        )
    }

    /* ── Not found ── */
    if (!profile) {
        return (
            <>
                <SecondNavbar />
                <div className="vp-error-state">
                    <i className="bi bi-person-x vp-error-icon" />
                    <p className="vp-error-text">User not found</p>
                    <button className="vp-back-btn" onClick={() => navigate(-1)}>
                        Go back
                    </button>
                </div>
            </>
        )
    }

    const initials = profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
    const isOwnProfile = currentUser?._id === profile._id
    const tabTitle = profile.role === 'investor'
        ? `Interested Ideas (${ideas.length})`
        : `Ideas (${ideas.length})`

    return (
        <>
            <SecondNavbar />

            <div className="vp-page">
                <Container className="vp-container">

                    {/* ── Profile Card ── */}
                    <div className="fk-card p-4 mb-4 vp-profile-card">
                        <div className="vp-cover" />

                        <div className="vp-avatar-row">
                            <div className={`fk-avatar vp-avatar`}>
                                {initials}
                            </div>

                            {!isOwnProfile && (
                                <div className="vp-actions">
                                    <button
                                        onClick={handleFollow}
                                        className={`vp-follow-btn ${isFollowing ? 'following' : 'not-following'}`}
                                    >
                                        <i className={`bi ${isFollowing ? 'bi-person-check-fill' : 'bi-person-plus'}`} />{' '}
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Name, role, bio */}
                        <div className="vp-info">
                            <h1 className="vp-name">{profile.name}</h1>

                            <span className={`vp-role-badge ${profile.role === 'investor' ? 'investor' : 'entrepreneur'}`}>
                                {profile.role}
                            </span>

                            {profile.location && (
                                <span className="vp-location">
                                    <i className="bi bi-geo-alt" /> {profile.location}
                                </span>
                            )}

                            <br />

                            {profile.bio && (
                                <span className="vp-bio">{profile.bio}</span>
                            )}

                            {/* Sector tags — investor only */}
                            {profile.role === 'investor' && profile.sectors?.length > 0 && (
                                <div className="vp-sectors">
                                    {profile.sectors.map(s => (
                                        <span key={s} className="vp-sector-tag">{s}</span>
                                    ))}
                                </div>
                            )}

                            {/* Ticket size — investor only */}
                            {profile.role === 'investor' && profile.ticketSize && (
                                <p className="vp-meta">
                                    <i className="bi bi-cash-coin" /> Ticket size:{' '}
                                    <strong>{profile.ticketSize}</strong>
                                </p>
                            )}

                            {/* Email — logged-in users only */}
                            {currentUser && profile.email && (
                                <p className="vp-email">
                                    <i className="bi bi-envelope" /> {profile.email}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Stats Row ── */}
                    <div className="row justify-content-center gap-3 mb-4 vp-stats-row">
                        {[
                            { value: ideas.length, label: profile.role === 'investor' ? 'Interested' : 'Ideas' },
                            { value: profile.followersCount ?? 0, label: 'Followers' },
                            { value: ideas.length, label: 'Posts' },
                        ].map(({ value, label }) => (
                            <div key={label} className="col text-center">
                                <div className="fk-card h-100 p-4 d-flex flex-column vp-stat-value">
                                    {value}
                                    <div className="vp-stat-label">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Tabs ── */}
                    <Tabs defaultActiveKey="ideas" className="mb-3 vp-tabs">
                        <Tab eventKey="ideas" title={tabTitle}>
                            <div className="mt-3">
                                {ideasLoading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" className="vp-spinner" />
                                    </div>
                                ) : ideas.length > 0 ? (
                                    <Row className="g-3">
                                        {ideas.map(idea => (
                                            <Col key={idea._id} xs={12}>
                                                <IdeaCard idea={idea} />
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <div className="text-center py-5">
                                        <i
                                            className={`bi ${profile.role === 'investor' ? 'bi-heart' : 'bi-lightbulb'} vp-empty-icon`}
                                        />
                                        <p className="mt-3 vp-empty-text">
                                            {profile.role === 'investor'
                                                ? `${profile.name} hasn't expressed interest in any ideas yet.`
                                                : `${profile.name} hasn't submitted any ideas yet.`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Tab>
                    </Tabs>

                </Container>
            </div>
        </>
    )
}