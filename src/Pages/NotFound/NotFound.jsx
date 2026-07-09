import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <Container className="text-center">
        <div style={{ fontSize: '6rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--fk-border)', lineHeight: 1 }}>
          404
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--fk-text-secondary)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn btn-primary"
          style={{ borderRadius: 'var(--radius-pill)', padding: '0.65rem 2rem', fontWeight: 700 }}
        >
          Back to Home
        </Link>
      </Container>
    </div>
  )
}
