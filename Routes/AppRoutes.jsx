import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../Context/AuthContext'

import Home from '../src/Pages/Home/Home'
import HomePageTwo from '../src/Pages/HomePageTwo/HomePageTwo'
import Contact from '../src/Pages/contact/Contact'
import NotFound from '../src/Pages/NotFound/NotFound'

import Login from '../src/Pages/Auth/Login'
import Register from '../src/Pages/Auth/Register'

import Profile from '../src/Pages/Profile/Profile'
import EditProfile from '../src/Pages/Profile/Editprofile'

import CreatePost from '../src/Pages/createPost/createPost'
import CreateIdea from '../src/Pages/CreateIdea/CreateIdea'
import EditIdea from '../src/Pages/EditIdea/EditIdea'
import IdeaDetails from '../src/Pages/IdeaDetails/IdeaDetails'
import BrowseProjects from '../src/Pages/BrowseProjects/BrowseProjects'

import InvestorPage from '../src/Pages/InvestorPage/InvestorPage'
import ViewProfile from '../src/Pages/InvestorPage/ViewProfile'

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />

  return children
}

export default function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -15 }}
        transition={{ duration: 0.1 }}
      >
        <Routes location={location}>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/home-two" element={<HomePageTwo />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Investor */}
          <Route path="/investor" element={<InvestorPage />} />
          <Route path="/view-profile/:id" element={<ViewProfile />} />

          {/* Projects / Ideas */}
          <Route path="/browse-projects" element={<BrowseProjects />} />
          <Route path="/browse-projects/:id" element={<IdeaDetails />} />
          <Route path="/create-idea" element={<CreateIdea />} />
          <Route path="/edit-idea/:id" element={<EditIdea />} />
          <Route path="/create-post" element={<CreatePost />} />

          {/* Profile (protected) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}