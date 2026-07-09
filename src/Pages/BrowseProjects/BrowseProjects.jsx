import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Spinner, Dropdown } from 'react-bootstrap'
import { useIdeas } from '../../../Context/IdeaContext'
import IdeaCard from '../../Components/cards/IdeaCard'
import { FaArrowLeft } from "react-icons/fa";
import { FiHome } from 'react-icons/fi'
import SecondNavbar from '../../Components/Common/SecondNavbar'
import { useAuth } from '../../../Context/AuthContext'
import './BrowseProjects.css'
const CATEGORIES = ['All', 'Tech', 'Health', 'Education', 'Finance', 'Environment', 'Social']

export default function BrowseProjects() {
    const { user: currentUser } = useAuth();
    const { ideas, loading, pagination, fetchIdeas } = useIdeas()
    const [searchParams, setSearchParams] = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [category, setCategory] = useState(searchParams.get('category') || 'All')
    const [sort, setSort] = useState('newest')
    const [page, setPage] = useState(1)

    const load = useCallback((overrides = {}) => {
        const params = {
            search: search || undefined,
            category: category !== 'All' ? category : undefined,
            sort,
            page,
            limit: 9,
            status: 'approved',
            ...overrides,
        }
        const sp = new URLSearchParams()
        if (params.search) sp.set('search', params.search)
        if (params.category) sp.set('category', params.category)
        setSearchParams(sp, { replace: true })
        fetchIdeas(params)
    }, [search, category, sort, page, fetchIdeas, setSearchParams])

    useEffect(() => { load() }, [category, sort, page]) // eslint-disable-line

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(1)
        load({ page: 1 })
    }

    return (


        <div className="browse-projects-page">
            {/* navbar */}
            <SecondNavbar />

            <Container className="browse-projects-container">
                    {/* Search + Filter bar */}
                <div className="d-flex align-items-center gap-3 flex-wrap mb-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="browse-search-form">
                        <i className="bi bi-search browse-search-icon" />
                        <Form.Control
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search projects, categories..."
                            className="browse-search-input"
                        />
                    </form>

                    {/* Stage dropdown */}


                    {/* Sort / Filters */}
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm"className="browse-filter-toggle">
                            <i className="bi bi-funnel me-1" />Filters
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="browse-filter-menu">
                            <Dropdown.Item onClick={() => setSort('newest')}>Newest First</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort('most_interest')}>Most Interest</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSort('most_viewed')}>Most Viewed</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => { setSearch(''); setCategory('All'); setSort('newest'); setPage(1); fetchIdeas({ status: 'approved', page: 1, limit: 9 }); setSearchParams({}) }}>
                                <i className="bi bi-x-circle me-1 text-danger" />Clear Filters
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {
                        currentUser?.role === "entrepreneur" &&
                        (
                            <Link to="/create-idea" className="btn btn-primary ms-auto browse-add-project-btn">
                                <i className="bi bi-plus me-1" />Add Your Project
                            </Link>
                        )

                    }

                </div>

                {/* Category Tabs (pill row) — optional, hidden on mobile can be scrollable */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => { setCategory(cat); setPage(1) }} className={`fk-cat-pill ${category === cat ? 'active' : ''}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" className="browse-loading-spinner" />
                        <p className="mt-3 browse-loading-text">Loading projects…</p>
                    </div>
                ) : ideas.length > 0 ? (
                    <>
                        <p className="browse-results-count">
                            Showing {ideas.length} of {pagination.total} projects
                        </p>
                        <Row className="g-3">
                            {ideas.map(idea => (
                                <Col key={idea._id} md={6} lg={4}>
                                    <IdeaCard idea={idea} />
                                </Col>
                            ))}
                        </Row>

                        {pagination.pages > 1 && (
                            <div className="d-flex justify-content-center gap-2 mt-5">
                                <Button variant="outline-secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="browse-pagination-btn">
                                    <i className="bi bi-chevron-left" />
                                </Button>
                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                                    <Button key={p} size="sm" variant={p === page ? 'primary' : 'outline-secondary'} onClick={() => setPage(p)} className="browse-pagination-number">
                                        {p}
                                    </Button>
                                ))}
                                <Button variant="outline-secondary" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="browse-pagination-btn">
                                    <i className="bi bi-chevron-right" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-search browse-empty-icon"/>
                        <p className="mt-3 mb-0 browse-empty-text">
                            No projects found. Try adjusting your filters.
                        </p>
                    </div>
                )}
            </Container>
        </div>
    )
}
