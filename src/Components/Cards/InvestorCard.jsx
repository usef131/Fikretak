import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaEnvelope, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./InvestorCard.css";

export default function InvestorCard({ investor }) {
    const navigate = useNavigate();
    const initials = investor.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card
            className="investor-card h-100 border-0"
            onMouseEnter={(e) => e.currentTarget.classList.add("investor-card--hovered")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("investor-card--hovered")}
        >
            <Card.Body className="investor-card__body d-flex flex-column">
                {/* Top: avatar + name */}
                <div className="investor-card__header">
                    <div className="investor-card__avatar">{initials}</div>
                    <div>
                        <p className="investor-card__name">{investor.name}</p>
                        <span className="investor-card__badge">Investor</span>
                    </div>
                </div>

                {/* Bio */}
                <p className="investor-card__bio">
                    {investor.bio ||
                        "Experienced investor looking for innovative startup ideas in the MENA region."}
                </p>

                {/* Sector tags */}
                {investor.sectors?.length > 0 && (
                    <div className="investor-card__sectors">
                        {investor.sectors.map((s) => (
                            <span key={s} className="investor-card__sector-tag">{s}</span>
                        ))}
                    </div>
                )}

                {/* Meta info */}
                <div className="investor-card__meta">
                    <div className="investor-card__meta-row">
                        <FaEnvelope size={13} className="investor-card__meta-icon" />
                        <span>{investor.email}</span>
                    </div>

                    {investor.ticketSize && (
                        <div className="investor-card__meta-row">
                            <FaMoneyBillWave size={13} className="investor-card__meta-icon" />
                            <span>{investor.ticketSize}</span>
                        </div>
                    )}

                    {investor.location && (
                        <div className="investor-card__meta-row">
                            <FaMapMarkerAlt size={13} className="investor-card__meta-icon" />
                            <span>{investor.location}</span>
                        </div>
                    )}
                </div>

                <hr className="investor-card__divider" />

                {/* Actions */}
                <div className="investor-card__actions">
                    <Button
                        className="investor-card__btn"
                        onClick={() => navigate(`/ViewProfile/${investor._id}`)}
                    >
                        View profile
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}