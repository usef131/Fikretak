import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import './Home.css'
import FooterLanding from "../../Components/Common/FooterLanding"
import Navbar from "../../../src/Components/Common/Navbar"
const FEATURES = [
  {
    icon: 'bi-rocket-takeoff',
    title: 'Project Marketplace',
    desc: 'Discover and invest in innovative startups. Browse structured project cards with funding goals, team info, and progress tracking.',
  },
  {
    icon: 'bi-people',
    title: 'Collaboration Board',
    desc: 'Find co-founders, developers, designers, and marketers. Join teams building the next big thing.',
  },
  {
    icon: 'bi-award',
    title: 'Expert Mentorship',
    desc: 'Book sessions with experienced entrepreneurs. Get guidance on fundraising, product, growth, and more.',
  },
  {
    icon: 'bi-currency-dollar',
    title: 'Investor Matching',
    desc: 'Smart recommendations connect investors with startups matching their interests and investment thesis.',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Progress Tracking',
    desc: "Track funding milestones, team updates, and growth metrics. Stay informed on every project's journey.",
  },
  {
    icon: 'bi-lightbulb',
    title: 'Idea Validation',
    desc: 'Share concepts, get feedback, and validate market fit before building. Community-driven innovation.',
  },
]

const ROLES = [
  { icon: 'bi-lightbulb-fill', title: 'Entrepreneur', sub: 'Share your groundbreaking ideas' },
  { icon: 'bi-graph-up', title: 'Investor', sub: 'Fund promising opportunities' },
]

const CHECKLIST = [
  'Browse 500+ startups seeking funding',
  'Connect with verified investors',
  'Track project milestones and growth',
  'Access startup resources and tools',
  'Apply to investment opportunities instantly',
  'Launch your startup in a few clicks',
  'Manage your startup progress in one dashboard',
]

export default function Home() {
  return (
    <div className="home-wrapper">
      <Navbar />  
      {/* ── HERO ── */}
      <section className="hero-section">
        <Container className="d-flex flex-column align-items-center text-center">

          <h1 className="hero-title" style={{ alignSelf: 'flex-start', marginLeft: '8%', color: '#fff', WebkitTextFillColor: '#fff' }}>
            Your Ideas Accelerated
          </h1>

          <p className="hero-subtitle">
            Connect innovators with investors. Turn your ideas into real projects with role-based collaboration.
          </p>

          <div className="d-flex gap-3 flex-wrap justify-content-center">
            <Button
              as={Link}
              to="/login"
              variant="primary"
              className="rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
            >
              Start Your Journey <span>→</span>
            </Button>

            <Button
              href="#about"
              variant="outline-light"
              className="rounded-pill px-4 py-2 fw-semibold"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stats-border" />
            {[
              { val: '10k+', label: 'Active Users' },
              { val: '5k+', label: 'Projects' },
              { val: '500+', label: 'Investors' },
            ].map((s, i, arr) => (
              <div key={s.label} className="d-flex align-items-center gap-4">
                <div className="text-center">
                  <span className="hero-stat-val">{s.val}</span>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
                {i < arr.length - 1 && <div className="hero-stat-divider" />}
              </div>
            ))}
          </div>

        </Container>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="features-section">
        <Container style={{ maxWidth: 1100 }}>

          <Row className="justify-content-center mb-5">
            <Col className="text-center">
              <h2 className="section-title">Everything you need to succeed</h2>
              <p className="section-subtitle">
                Built for innovators and entrepreneurs who want to turn ideas into reality
              </p>
            </Col>
          </Row>

          <Row className="g-2">
            {FEATURES.map((f) => (
              <Col key={f.title} md={4}>
                <div className="feature-card h-100">
                  <div className="feature-card-inner h-100">
                    <div className="feature-icon-wrap">
                      <i className={`bi ${f.icon} feature-icon`} />
                    </div>
                    <h3 className="feature-title">{f.title}</h3>
                    <p className="feature-desc">{f.desc}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

        </Container>
      </section>

      {/* ── FROM IDEA TO FUNDED STARTUP ── */}
      <section id="about" className="about-section">
        <Container style={{ maxWidth: 1100 }}>
          <Row className="align-items-center g-5">

            {/* LEFT */}
            <Col md={6}>
              <h2 className="about-title">From Idea to Funded Startup</h2>
              <p className="about-body">
                Join 10,000+ entrepreneurs and 486 active investors building the future together.
                Your complete startup journey starts here.
              </p>
              <ul className="checklist">
                {CHECKLIST.map(item => (
                  <li key={item} className="checklist-item">
                    <span className="checklist-dot">
                      <i className="bi bi-check-lg" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Col>

            {/* RIGHT */}
            <Col md={6}>
              <div className="roles-card">
                {ROLES.map(r => (
                  <div
                    key={r.title}
                    className="role-item"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="role-icon-wrap">
                      <i className={`bi ${r.icon} role-icon`} />
                    </div>
                    <div>
                      <div className="role-title">{r.title}</div>
                      <div className="role-sub">{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section text-center">
        <div className="cta-rings"></div>
        <Container className="position-relative">
          <h2 className="cta-title">Join the Startup Revolution</h2>
          <p className="cta-sub">
            2,500+ ideas validated • $45M+ in funding raised • 1,000+ teams formed
          </p>
          <Link to="/register" className="cta-btn">
            Get Started for Free <span>→</span>
          </Link>
        </Container>
      </section>

      {/* ── FOOTER ── */}
         <FooterLanding/>
      

    </div>
  );
}
