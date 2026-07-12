import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/InvestorCard.css";

export default function FollowCard({ person, onUnfollow }) {
    const navigate = useNavigate();
    const initials = person.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card className="investor-card h-100 border-0">
            <Card.Body className="investor-card__body d-flex flex-column">
                <div className="investor-card__header">
                    <div className="investor-card__avatar">{initials}</div>
                    <div>
                        <p className="investor-card__name">{person.name}</p>
                        <span className="investor-card__badge">
                            {person.role === "investor" ? "Investor" : "Entrepreneur"}
                        </span>
                    </div>
                </div>

                {person.bio && <p className="investor-card__bio">{person.bio}</p>}

                {person.location && (
                    <div className="investor-card__meta">
                        <div className="investor-card__meta-row">
                            <FaMapMarkerAlt size={13} className="investor-card__meta-icon" />
                            <span>{person.location}</span>
                        </div>
                    </div>
                )}

                <hr className="investor-card__divider" />

                <div className="investor-card__actions d-flex gap-2">
                    <Button
                        className="investor-card__btn flex-grow-1"
                        onClick={() => navigate(`/view-profile/${person._id}`)}
                    >
                        View profile
                    </Button>
                    {onUnfollow && (
                        <Button variant="outline-secondary" onClick={() => onUnfollow(person._id)}>
                            Unfollow
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}