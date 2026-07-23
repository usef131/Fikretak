import { Badge, Button, ProgressBar } from "react-bootstrap";
import { useState } from "react";
import InvestModal from "../Invest/Investmodal";

const CATEGORY_COLORS = {
    Tech: { bg: '#dbeafe', color: '#2563eb' },
    Health: { bg: '#dcfce7', color: '#16a34a' },
    Education: { bg: '#fef3c7', color: '#b45309' },
    Finance: { bg: '#ede9fe', color: '#7c3aed' },
    Environment: { bg: '#d1fae5', color: '#065f46' },
    Social: { bg: '#fee2e2', color: '#dc2626' },
    Other: { bg: '#f3f4f6', color: '#6b7280' },
}

export default function FeaturedStartupRow({ startup, NAVY, navigate, role }) {

    const colors = CATEGORY_COLORS[startup.badge] || CATEGORY_COLORS.Other
     const [showInvest, setShowInvest] = useState(false)
    return (
        <>
        <tr className="featured-row">
            <td className="ps-4 fs-cell-primary" data-label="Startup">
                <div className="d-flex align-items-center gap-3">
                    <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: "#e9eff7", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontWeight: 700, color: NAVY,
                    }}>
                        {startup.name?.[0]}
                    </div>
                    <div>
                        <div className="fw-bold">{startup.name}</div>
                        <small className="text-primary">{startup.category}</small>
                    </div>
                </div>
            </td>

            <td data-label="Status">
                <Badge bg="" style={{
                    background: colors.bg,
                    color: colors.color,
                    padding: '6px 10px',
                    borderRadius: '999px',
                }}>
                    {startup.badge}
                </Badge>
            </td>

            <td style={{ width: "35%" }} data-label="Description">
                <span className="text-secondary">{startup.desc}</span>
            </td>

            <td data-label="Funding">
                <div>
                    <strong>{startup.funding}</strong>
                    <span className="text-muted ms-1">Target</span>
                </div>
                <small className="text-muted">{startup.team}</small>
            </td>

            <td style={{ minWidth: 140 }} data-label="Progress">
                <ProgressBar now={startup.progress} style={{ height: 5 }} className="mb-1" />
                <small className="fw-semibold" style={{ color: NAVY }}>{startup.progress}%</small>
            </td>

            <td data-label="Actions" className="fs-cell-actions">
                {role === "entrepreneur" ? (
                    <div className="d-flex justify-content-center">
                        <Button
                            size="sm"
                            style={{
                                background: "#2563eb",
                                border: "none",
                                padding: "8px 24px",
                                borderRadius: "999px",
                            }}
                            onClick={() => navigate(`/browse-projects/${startup._id}`)}
                        >
                            View
                        </Button>
                    </div>
                ) : (
                    <div className="d-flex align-items-center justify-content-center gap-3">
                        <Button
                            size="sm"
                            style={{
                                background: "#2563eb",
                                border: "none",
                                padding: "8px 24px",
                                borderRadius: "999px",
                            }}
                            onClick={() => navigate(`/browse-projects/${startup._id}`)}
                        >
                            View
                        </Button>
                            <Button size="sm"
                                style={{ background: NAVY, border: "none", padding: "8px 20px", borderRadius: "999px" }}
                                onClick={() => setShowInvest(true)}>
                                Invest
                            </Button>
                    </div>
                )}
            </td>
        </tr>
         <InvestModal show={showInvest} onHide={() => setShowInvest(false)} idea={startup} />
             </>
    )
}