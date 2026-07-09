import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import '../../assets/styles/Footer.css'

export default function Footer() {
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
              <li><Link to="/browse-projects">Browse Ideas</Link></li>  
            </ul>
          </Col>
          <Col md={2}>
            <h6>Company</h6>
            <ul className="list-unstyled fk-footer-links">
              <li><Link to="/">About</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Legal</h6>
            <ul className="list-unstyled fk-footer-links">
              <li><Link to="/contact">Contact</Link></li>
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
