require('dotenv').config()
const app       = require('./app')
const connectDB = require('./Config/connectDB')

const PORT = process.env.PORT || 5002

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Copy backend/.env.example to backend/.env and set it.')
  process.exit(1)
}

// Local / single-service (Render) start: connect once, then listen.
connectDB()
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch(err => { console.error('❌ MongoDB connection failed:', err); process.exit(1) })
