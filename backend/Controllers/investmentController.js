const Investment = require('../Models/Investments')
const Idea = require('../Models/Idea')

exports.createInvestment = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) return res.status(404).json({ message: 'Idea not found' })

    const { fullName, company, linkedin, experience, amount, message } = req.body

    if (!fullName?.trim()) {
      return res.status(400).json({ message: 'Full name is required' })
    }

    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'A positive investment amount is required' })
    }

    const investment = await Investment.create({
      idea: idea._id,
      investor: req.user._id,
      fullName, company, linkedin, experience,
      amount: numericAmount,
      message,
    })

    idea.investments.push(investment._id)
    idea.fundingRaised = (idea.fundingRaised || 0) + numericAmount
    await idea.save()

    res.status(201).json({ investment })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// GET /api/ideas/:id/investments — list investments for an idea
exports.getInvestments = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) return res.status(404).json({ message: 'Idea not found' })

    const investments = await Investment.find({ idea: idea._id })
      .sort({ createdAt: -1 })
      .populate('investor', 'name avatar')

    res.json({ investments })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
