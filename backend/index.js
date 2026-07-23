require('dotenv').config()
const path        = require('path')
const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const compression = require('compression')
const mongoose    = require('mongoose')
const rateLimit   = require('express-rate-limit')

const sanitize        = require('./Middleware/sanitize')
const postRoutes       = require('./Routes/post')
const authRoutes       = require('./Routes/auth')
const ideaRoutes       = require('./Routes/ideas')
const userRoutes       = require('./Routes/Investors')
const investmentRoutes = require('./Routes/investment')
const uploadRoutes     = require('./Routes/upload')

const app = express()

// ── Security & core middleware ──
app.use(helmet())
app.use(compression())

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  // keep common Vite dev ports working out of the box
  .concat(['http://localhost:5173', 'http://localhost:5175'])
app.use(cors({
  origin: [...new Set(allowedOrigins)],
  credentials: true,
}))

app.use(express.json({ limit: '1mb' })) // images go through /api/uploads, not JSON
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(sanitize) // strip NoSQL operator injection from all input

// Serve uploaded images (allow the frontend origin to load them)
app.use(
  '/uploads',
  (_req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
  },
  express.static(path.join(__dirname, 'uploads')),
)

// ── Rate limiting ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
})
// Stricter limiter for auth to slow brute-force / credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
})
app.use('/api', apiLimiter)

// ── Routes ──
app.use('/api/auth',  authLimiter, authRoutes)
app.use('/api/ideas', ideaRoutes)
app.use('/api/users', userRoutes)
app.use('/api/ideas/:id/investments', investmentRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/uploads', uploadRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }))

// 404
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal server error',
  })
})

// ── Database + Start ──
const PORT = process.env.PORT || 5002

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Copy backend/.env.example to backend/.env and set it.')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch(err => { console.error('❌ MongoDB connection failed:', err); process.exit(1) })
