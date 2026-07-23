const mongoose = require('mongoose')

const investmentSchema = new mongoose.Schema({
  idea:       { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  investor:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName:   { type: String, required: true },
  company:    { type: String, default: '' },
  linkedin:   { type: String, default: '' },
  experience: { type: String, default: '' },
  amount:     { type: Number, required: true },
  message:    { type: String, default: '' },
}, { timestamps: true })

investmentSchema.index({ idea: 1, createdAt: -1 })
investmentSchema.index({ investor: 1 })

module.exports = mongoose.model('Investment', investmentSchema)