import { FiHome, FiCompass, FiGift, FiUser, FiLogOut } from "react-icons/fi";

import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

import logo from "../../assets/images/logo1.png";
import "../../styles/navbar.css";


function SecondNavbar() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Navbar
            bg="white"
            expand="lg"
            className="shadow-sm border-bottom py-2 sticky-top"
        >
            <Container fluid="lg">

                {/* LOGO */}
                <Navbar.Brand
                    onClick={() => navigate("/home-two")}
                    className="navbar-brand-custom"
                >
                    <img
                        src={logo}
                        alt="logo"
                        style={{ width: "36px", height: "36px" }}
                    />
                    Fikretak
                </Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse>

                    {/* NAV LINKS */}
                    <Nav className="mx-auto gap-1 align-items-center">

                        <NavLink to="/Home-Two" className="nav-link-custom">
                            <FiHome size={17} />
                            Home
                        </NavLink>

                        <NavLink to="/browse-projects" className="nav-link-custom">
                            <FiCompass size={17} />
                            Projects
                        </NavLink>

                        <NavLink to="/investor" className="nav-link-custom">
                            <FiGift size={17} />
                            Investors
                        </NavLink>

                        <NavLink to="/profile" className="nav-link-custom">
                            <FiUser size={17} />
                            Profile
                        </NavLink>

                    </Nav>

                    {/* RIGHT SIDE */}
                    <div className="d-flex align-items-center gap-3 ms-lg-3">

                        <Link to="/profile" className="nav-avatar">
                            {user?.name?.slice(0, 2).toUpperCase() || "U"}
                        </Link>

                        <button
                            className="nav-logout-btn"
                            onClick={() => navigate("/login")}
                        >
                            <FiLogOut size={18} color="#dc3545" />
                        </button>

                    </div>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default SecondNavbar;