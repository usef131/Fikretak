require('dotenv').config()
const express    = require('express')
const cors       = require('cors')
const mongoose   = require('mongoose')
const rateLimit  = require('express-rate-limit')
const postRoutes  = require('./routes/post')
const authRoutes  = require('./routes/auth')
const ideaRoutes  = require('./routes/ideas')
const userRoutes = require('./routes/Investors')
const investmentRoutes = require('./Routes/investment')


const app = express()

// ── Middleware ──
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5175'],
  credentials: true 
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' })
app.use('/api', limiter)

// ── Routes ──
app.use('/api/auth',  authRoutes)
app.use('/api/ideas', ideaRoutes)
app.use('/api/users', userRoutes)
app.use('/api/ideas/:id/investments', investmentRoutes)
app.use('/api/posts', postRoutes)



// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// ── Database + Start ──
const PORT = process.env.PORT || 5003

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch(err => { console.error('❌ MongoDB connection failed:', err); process.exit(1) })
