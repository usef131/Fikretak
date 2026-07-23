import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import InvestorCard from "../../Components/Cards/InvestorCard";
import SecondNavbar from "../../Components/Common/SecondNavbar";
import { useAuth } from "../../../Context/AuthContext";
import "../../assets/styles/InvestorPage.css";
import investorService from "../../../Services/InvestorServices";

const ALL_SECTORS = [
  "All",
  "Fintech",
  "EdTech",
  "AgriTech",
  "HealthTech",
  "CleanEnergy",
  "E-commerce",
  "Logistics",
];

export default function Investors() {

  const { user: currentUser } = useAuth();
  const [investors, setInvestors] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      // get all investors from api 
      const res = await investorService.getInvestors();
      setInvestors(
        // Exclude the current user from the list of investors 
        res.investors.filter((inv) => inv._id !== currentUser?._id)
      );
    } catch (err) {
      console.log(err); 
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {

    return investors.filter((inv) => {
      const matchesSearch =
        search.trim() === "" ||
        inv.name?.toLowerCase().includes(search.toLowerCase()) ||
        inv.bio?.toLowerCase().includes(search.toLowerCase()) ||
        inv.sectors?.some((s) =>
          s.toLowerCase().includes(search.toLowerCase())
        );

      const matchesSector =
        activeFilter === "All" || inv.sectors?.includes(activeFilter);

      return matchesSearch && matchesSector;
    });
  }, [investors, search, activeFilter]);

  return (
    <>
      <SecondNavbar />

      <Container className="investors-container">
        <div className="page-header">
          <h1>Investors</h1>
          <p>Connect with investors who believe in Egyptian entrepreneurship</p>
        </div>

        <div className="filters">
          <div className="search-box">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search by name or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sector-pills">
            {ALL_SECTORS.map((sector) => (
              <button
                key={sector}
                className={`sector-btn ${activeFilter === sector ? "active" : ""
                  }`}
                onClick={() => setActiveFilter(sector)}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading investors...</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <FaSearch className="empty-icon" />

            <p className="empty-title">No investors found</p>

            <p className="empty-subtitle">
              Try a different search term or adjust your sector filter.
            </p>

            <button
              className="clear-btn"
              onClick={() => {
                setSearch("");
                setActiveFilter("All");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <Row className="g-4">
            {filtered.map((investor) => (
              <Col md={4} key={investor._id}>
                <InvestorCard investor={investor} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}