import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

import CreatePost from '../src/Pages/createPost/createPost'
import Home from '../src/Pages/Home/Home'
import IdeaDetails from '../src/Pages/IdeaDetails/IdeaDetails'
import CreateIdea from '../src/Pages/CreateIdea/CreateIdea'
import Profile from '../src/Pages/Profile/Profile'
import Login from '../src/Pages/Auth/Login'
import Register from '../src/Pages/Auth/Register'
import NotFound from '../src/Pages/NotFound/NotFound'
import HomePageTwo from '../src/Pages/HomePageTwo/HomePageTwo'
import Contact from '../src/Pages/contact/Contact'
import BrowseProjects from '../src/Pages/BrowseProjects/BrowseProjects'
import EditProfile from '../src/Pages/Profile/Editprofile'
import InvestorPage from '../src/Pages/InvestorPage/InvestorPage'
import { AnimatePresence, motion } from "framer-motion";
import ViewProfile from '../src/Pages/InvestorPage/ViewProfile'
import EditIdea from '../src/Pages/EditIdea/EditIdea'

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

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/Investor" element={<InvestorPage />} />

          <Route path="/edit-idea/:id" element={<EditIdea />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/browse-projects" element={<BrowseProjects />} />
          <Route path="/browse-projects/:id" element={<IdeaDetails />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/home-two" element={<HomePageTwo />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route path='ViewProfile/:id' element={<ViewProfile />} />


          <Route
            path="/create-idea"
            element={<CreateIdea />}
          />

          <Route
            path="/create-post"
            element={<CreatePost />}
          />


          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />


        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}