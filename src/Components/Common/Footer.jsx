import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import '../../assets/styles/Footer.css'

// variant="app" (default) links into the authenticated app.
// variant="landing" links suit the public marketing page.
export default function Footer({ variant = 'app' }) {
  const links = variant === 'landing'
    ? { browse: '/register', about: '/#features', contact: '/contact' }
    : { browse: '/browse-projects', about: '/', contact: '/contact' }

  return (
    <footer className="fk-footer">
      <Container>
        <Row className="g-4 mb-4">
          {/* Brand */}
          <Col md={4}>
            <div className="fk-footer-brand">
              Fikretak
            </div>
            <p className="fk-footer-tagline">
              Where ideas meet action. Building the future of collaboration between entrepreneurs and investors.
            </p>
          </Col>
          <Col md={2} className="offset-md-2">
            <h6>Product</h6>
            <ul className="list-unstyled fk-footer-links">
              <li><Link to={links.browse}>Browse Ideas</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Company</h6>
            <ul className="list-unstyled fk-footer-links">
              <li><Link to={links.about}>About</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Legal</h6>
            <ul className="list-unstyled fk-footer-links">
              <li><Link to={links.contact}>Contact</Link></li>
            </ul>
          </Col>
        </Row>
        <hr className="fk-footer-divider" />
        <p className="fk-footer-copyright">
          © {new Date().getFullYear()} Fikretak. All rights reserved. Built with{' '}
          <i className="bi bi-heart-fill"></i> by the Fikretak Team.
        </p>
      </Container>
    </footer>
  )
}
