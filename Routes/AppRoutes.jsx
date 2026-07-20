import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Spinner } from 'react-bootstrap'
import { useAuth } from '../Context/AuthContext'
import ErrorBoundary from '../src/Components/Common/ErrorBoundary'

// Lazy-loaded pages (code splitting)
const Home           = lazy(() => import('../src/Pages/Home/Home'))
const HomePageTwo    = lazy(() => import('../src/Pages/HomePageTwo/HomePageTwo'))
const Contact        = lazy(() => import('../src/Pages/contact/Contact'))
const NotFound       = lazy(() => import('../src/Pages/NotFound/NotFound'))
const Login          = lazy(() => import('../src/Pages/Auth/Login'))
const Register       = lazy(() => import('../src/Pages/Auth/Register'))
const Profile        = lazy(() => import('../src/Pages/Profile/Profile'))
const EditProfile    = lazy(() => import('../src/Pages/Profile/Editprofile'))
const CreatePost     = lazy(() => import('../src/Pages/createPost/createPost'))
const CreateIdea     = lazy(() => import('../src/Pages/CreateIdea/CreateIdea'))
const EditIdea       = lazy(() => import('../src/Pages/EditIdea/EditIdea'))
const IdeaDetails    = lazy(() => import('../src/Pages/IdeaDetails/IdeaDetails'))
const BrowseProjects = lazy(() => import('../src/Pages/BrowseProjects/BrowseProjects'))
const InvestorPage   = lazy(() => import('../src/Pages/InvestorPage/InvestorPage'))
const ViewProfile    = lazy(() => import('../src/Pages/InvestorPage/ViewProfile'))

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner animation="border" />
    </div>
  )
}

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/home-two" replace />

  return children
}

export default function AppRoutes() {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.1 }}
        >
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/home-two" element={<HomePageTwo />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Investors (require login) */}
              <Route path="/investor" element={<PrivateRoute><InvestorPage /></PrivateRoute>} />
              <Route path="/view-profile/:id" element={<PrivateRoute><ViewProfile /></PrivateRoute>} />

              {/* Projects / Ideas */}
              <Route path="/browse-projects" element={<BrowseProjects />} />
              <Route path="/browse-projects/:id" element={<IdeaDetails />} />
              <Route
                path="/create-idea"
                element={<PrivateRoute roles={['entrepreneur']}><CreateIdea /></PrivateRoute>}
              />
              <Route
                path="/edit-idea/:id"
                element={<PrivateRoute roles={['entrepreneur']}><EditIdea /></PrivateRoute>}
              />
              <Route
                path="/create-post"
                element={<PrivateRoute><CreatePost /></PrivateRoute>}
              />

              {/* Profile (protected) */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  )
}
