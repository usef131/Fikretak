require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const User     = require('../models/User')
const Idea     = require('../models/Idea')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  // Clear existing
  await User.deleteMany()
  await Idea.deleteMany()

  // Create users
 
  const entrepreneur = await User.create({
    name: 'Youssef Ahmed', email: 'youssef@example.com',
    password: 'password123', role: 'entrepreneur',
    bio: 'CS student passionate about EdTech and AI.',
  })

  const investor = await User.create({
    name: 'Sara Hassan', email: 'sara@example.com',
    password: 'password123', role: 'investor',
    bio: 'Angel investor focused on Egyptian startups.',
  })

  // Create ideas
  await Idea.create([
    {
      title: 'AI Tutor for Egyptian Students',
      summary: 'An AI-powered tutoring platform that personalizes learning for Egyptian K-12 students.',
      description: 'We leverage GPT-based models fine-tuned on the Egyptian curriculum to provide adaptive tutoring in Arabic and English.',
      category: 'Education',
      targetMarket: 'K-12 students in Egypt',
      fundingGoal: 75000,
      entrepreneur: entrepreneur._id,
      interestedInvestors: [investor._id],
      interestCount: 1,
      views: 42,
    },
    {
      title: 'FarmLink – Agricultural Marketplace',
      summary: 'Connecting Egyptian farmers directly with buyers, cutting out the middleman.',
      category: 'Tech',
      targetMarket: 'Farmers and food distributors in Egypt',
      fundingGoal: 50000,
      entrepreneur: entrepreneur._id,
      views: 28,
    },
    {
      title: 'CareNear – Homecare Services App',
      summary: 'On-demand homecare and nursing services for elderly Egyptians.',
      category: 'Health',
      targetMarket: 'Elderly and their families in Cairo and Alexandria',
      fundingGoal: 40000,
      entrepreneur: entrepreneur._id,
    },
  ])
}

seed().catch(err => { console.error(err); process.exit(1) })
