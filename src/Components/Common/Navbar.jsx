import { Link, useNavigate } from 'react-router-dom'
import { Navbar as BSNavbar, Container, Button } from 'react-bootstrap'
import { useAuth } from '../../../Context/AuthContext'
import '../../assets/styles/landingNavbar.css'
  

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <BSNavbar expand="lg" className="fk-navbar" sticky="top">
      <Container>

        {/* BRAND */}
        <BSNavbar.Brand as={Link} to="/" className="fk-navbar-brand">
          فِــــكْــرِتَــكْ   Fikretak
        </BSNavbar.Brand>

        {/* RIGHT SIDE */}
        <div className="fk-auth-actions">

          <Button
            as={Link}
            to="/login"
            variant="outline-light"
            className="fk-btn-outline"
          >
            Sign In
          </Button>

          <Button
            as={Link}
            to="/register"
            className="fk-btn-primary"
          >
            Get Started
          </Button>

        </div>

      </Container>
    </BSNavbar>
  )
}