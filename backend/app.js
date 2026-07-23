require('dotenv').config()
const fs          = require('fs')
const path        = require('path')
const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const compression = require('compression')
const rateLimit   = require('express-rate-limit')

const connectDB        = require('./Config/connectDB')
const sanitize         = require('./Middleware/sanitize')
const postRoutes       = require('./Routes/post')
const authRoutes       = require('./Routes/auth')
const ideaRoutes       = require('./Routes/ideas')
const userRoutes       = require('./Routes/Investors')
const investmentRoutes = require('./Routes/investment')
const uploadRoutes     = require('./Routes/upload')

const app = express()

// Behind a proxy (Vercel/Render) so req.ip / rate-limiting see the real client
app.set('trust proxy', 1)

// ── Security & core middleware ──
// Tailored CSP so the single-service prod build can load Google Fonts,
// Cloudinary/Unsplash images, and call the EmailJS API from the contact form.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https://api.emailjs.com'],
        'font-src': ["'self'", 'https:', 'data:'],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
      },
    },
  }),
)
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

// Serve uploaded images from local disk (dev fallback; no-op with Cloudinary)
app.use(
  '/uploads',
  (_req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
  },
  express.static(path.join(__dirname, 'uploads')),
)

// Health check (no DB dependency)
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }))

// Ensure MongoDB is connected before handling any data route
app.use('/api', async (_req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('DB connection error:', err.message)
    res.status(503).json({ message: 'Database unavailable' })
  }
})

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

// ── Serve the built React app (single-service deploy, e.g. Render/local) ──
// On Vercel the static frontend is served by the platform and ../dist is not
// bundled with the function, so this block is skipped there.
const clientDist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

// 404 (API routes / unmatched)
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal server error',
  })
})

module.exports = app
