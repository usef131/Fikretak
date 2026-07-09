import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Stack, Image, Table } from "react-bootstrap";
import SecondNavbar from "../../Components/Common/SecondNavbar";
import Footer from "../../Components/Common/Footer";
import PageTransition from "./PageTransition";
import FeaturedStartupRow from "../../Components/Cards/FeaturedStartupRow";
import "../../assets/styles/HomeTwo.css";
import PostCard from "../../Components/Cards/postCard";
import { FaHeart, FaRegCommentDots, FaArrowRight } from "react-icons/fa";
import { postService } from "../../../Services/postServices";
import api from "../../../Services/api";

const NAVY = "#0f2744";

const STATS = [
  { value: "2,547", label: "Ideas Shared", delta: "+12.5%" },
  { value: "486", label: "Active Investors", delta: "+8.3%" },
  { value: "143", label: "Projects Funded", delta: "+15.7%" },
  { value: "1,089", label: "Collaborations", delta: "+20.1%" }
];

export default function HomePageTwo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [startups, setStartups] = useState([]);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);


  useEffect(() => {
      api.get("/posts")
      .then(data => {
        console.log("posts from API:", data)
        setPosts(data.posts || data)
      })
      .catch(err => console.error('Failed to fetch posts:', err))
  }, [])

  useEffect(() => {
    api.get("/ideas")
      .then(data => {
        setStartups(data.ideas || data);
      });
  }, []);

  return (
    <div className="homepage">

      <SecondNavbar />

      {/* HERO */}
      <section className="hero">
        <PageTransition>
          {/* ── Profile completion banner ── */}
          {user?.role === 'investor' && (!user?.bio || !user?.sectors?.length || !user?.ticketSize || !user?.location) && (
            <div style={{
              background: '#fefce8',
              borderBottom: '1px solid #fde68a',
              padding: '12px 0',
              marginTop:'-90px',
              marginBottom: '50px',
            }}>
              <Container className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 10 }}>
                <div className="d-flex align-items-center" style={{ gap: 10 }}>
                  <i className="bi bi-exclamation-circle-fill" style={{ color: '#d97706', fontSize: '1.1rem' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400e' }}>
                    Complete your investor profile so entrepreneurs can find you
                  </span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {!user?.bio && <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', background: '#fde68a', color: '#92400e', fontWeight: 600 }}>Bio</span>}
                    {!user?.location && <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', background: '#fde68a', color: '#92400e', fontWeight: 600 }}>Location</span>}
                    {!user?.ticketSize && <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', background: '#fde68a', color: '#92400e', fontWeight: 600 }}>Ticket size</span>}
                    {!user?.sectors?.length && <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', background: '#fde68a', color: '#92400e', fontWeight: 600 }}>Sectors</span>}
                  </div>
                </div>
                <button
                  onClick={() => navigate('/edit-profile')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: '1.5px solid #d97706',
                    background: '#fff',
                    color: '#92400e',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Complete Profile →
                </button>
              </Container>
            </div>
          )}
          {/* HERO */}
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={10}>

                <h1 className="hero-title ">
                  Welcome to <span>Fikretak</span>
                </h1>

                <p className="hero-description">
                  The professional ecosystem where innovators find funding,
                  and the teams they need to scale. Connect with the right people
                  to turn your vision into reality.
                </p>

                <div className="d-flex justify-content-center flex-wrap gap-3 mt-5">

                  {
                    user?.role === "entrepreneur" ?

                      <>
                        <Button
                          className="main-btn primary-btn"
                          onClick={() => navigate("/create-idea")}
                        >
                          ⊕ Add Project
                        </Button>

                        <Button
                          className="main-btn white-btn"
                          onClick={() => navigate("/browse-projects")}
                        >
                          Browse Projects
                        </Button>

                        <Button
                          className="main-btn white-btn"
                          onClick={() => navigate("/investor")}
                        >
                          Find Investors
                        </Button>


                      </>


                      :
                      <Button
                        className="main-btn primary-btn"
                        onClick={() => navigate("/browse-projects")}
                      >
                        Browse Projects
                      </Button>
                  }

                </div>

              </Col>

            </Row>

          </Container>

        </PageTransition>

      </section>

      {/* STATS */}
      <Container fluid className="stats">
        <Row>
          {
            STATS.map((s, index) => (

              <Col
                key={s.label}
                xs={6}
                lg={3}
                className="stat-box"
              >

                <div className="stat-label">
                  {s.label}
                </div>

                <div className="d-flex align-items-center gap-2">

                  <span className="stat-number">
                    {s.value}
                  </span>

                  <span className="growth">
                    {s.delta}
                  </span>

                </div>

              </Col>
            ))}

        </Row>

      </Container>


      {/* FEATURED */}
      <Container fluid className="px-5 mt-5 mb-5">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold">
              Featured Startups
            </h2>

            <p className="text-muted">
              Trending projects seeking funding and collaboration
            </p>

          </div>

          <Button
            variant="link"
            className="view-btn"
            onClick={() => navigate("/browse-projects")}
          >
            View All →
          </Button>

        </div>


        <Card className="featured-card">

          <Table
            responsive
            className="featured-table mb-0"
          >

            <thead>

              <tr>
                <th>Startup & Industry</th>
                <th>Status</th>
                <th>Description</th>
                <th>Team & Funding</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {
                startups.slice(0, 3).map(startup => (

                  <FeaturedStartupRow
                    key={startup._id}
                    startup={{

                      ...startup,

                      name: startup.title,
                      badge: startup.category || "Idea",
                      desc: startup.summary,
                      funding:
                        startup.fundingGoal
                          ?
                          `$${Number(startup.fundingGoal).toLocaleString()}`
                          :
                          "Not set",
                      team:
                        `${startup.interestCount || 0} interested`,
                      progress:
                        startup.fundingGoal && startup.fundingRaised
                          ?
                          Math.min(
                            100,
                            Math.round(
                              startup.fundingRaised /
                              startup.fundingGoal *
                              100
                            )
                          )
                          :
                          0
                    }}


                    NAVY={NAVY}
                    navigate={navigate}
                    role={user?.role}
                  />
                ))}

            </tbody>
          </Table>

        </Card>
      </Container>

      {/* ── Featured Startups ── */}
      <Container fluid className="px-5 my-5">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">
              Featured Posts
            </h2>

            <p className="text-muted mb-0">
              Discover the latest ideas shared by entrepreneurs.
            </p>
          </div>

        </div>

        <div className="d-flex flex-column gap-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={(id) =>
                setPosts(prev => prev.filter(p => p._id !== id))
              }
            />
          ))}
        </div>

      </Container>

      {/* CTA */}
      <section className="cta">
        <div className="rings"></div>
        <Container className="text-center position-relative">

          <h2 className="text-white fw-bold">
            Ready to Build the Future?
          </h2>

          <p style={{ color: "rgba(255,255,255,0.65)" }}>
            Join thousands of entrepreneurs, investors,
            and innovators transforming ideas into reality
          </p>

          <Button
            className="investor-btn"
            onClick={() => navigate("/ideas")}
          >
            Explore Opportunities
          </Button>

        </Container>
      </section>

      <Footer />
    </div>);
}