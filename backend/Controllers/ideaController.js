const Idea = require("../models/Idea");

// GET /api/ideas
exports.getIdeas = async (req, res) => {
  try {
    const {
      search,
      category,
      sort,
      status = "approved",
      page = 1,
      limit = 9,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      most_interest: { interestCount: -1 },
      most_viewed: { views: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Idea.countDocuments(filter);
    const ideas = await Idea.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate("entrepreneur", "name");

    res.json({
      ideas,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ideas/my
exports.getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ entrepreneur: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ ideas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ideas/:id
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate("entrepreneur", "name email bio")
      .populate("interestedInvestors", "name");

    if (!idea) return res.status(404).json({ message: "Idea not found" });

    // Increment view count (fire-and-forget)
    Idea.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json({ idea });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ideas
exports.createIdea = async (req, res) => {
  try {
    const {
      title,
      summary,
      description,
      category,
      targetMarket,
      fundingGoal,
      fundingRaised,
      teamSize,
      mission,
      impactScore,
      marketSize,
      userGrowth,
      co2Saved,
      roadmap,
    } = req.body;

    const image = req.body.image;

    const idea = await Idea.create({
      title,
      summary,
      description,
      category,
      targetMarket,
      fundingGoal,
      fundingRaised,
      teamSize,
      image,
      mission,
      impactScore,
      marketSize,
      userGrowth,
      co2Saved,
      roadmap,
      entrepreneur: req.user._id,
      status: "approved",
    });
    await idea.populate("entrepreneur", "name");
    res.status(201).json({ idea });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getIdeasByUser = async (req, res) => {
  try {
    const ideas = await Idea.find({ entrepreneur: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("entrepreneur", "name");
    res.json({ ideas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/ideas/:id
exports.updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    if (idea.entrepreneur.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' })

    const allowed = [
      'title', 'summary', 'description', 'category',
      'targetMarket', 'fundingGoal', 'image', 'teamMembers'
    ]
    allowed.forEach(f => { if (req.body[f] !== undefined) idea[f] = req.body[f] })

    
    if (req.body.teamMembers !== undefined) idea.teamSize = req.body.teamMembers

   
    if (req.body.roadmap !== undefined) {
      idea.roadmap = req.body.roadmap
      idea.markModified('roadmap')
    }

    await idea.save()
    res.json({ idea })
      return res.status(403).json({ message: "Not authorized" });

     allowed = [
      "title",
      "summary",
      "description",
      "category",
      "targetMarket",
      "fundingGoal",
    ];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) idea[f] = req.body[f];
    });
    // ⬅ no longer resets to 'pending' — edits stay approved/live immediately
    await idea.save();
    res.json({ idea });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/ideas/:id
exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    if (idea.entrepreneur.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await idea.deleteOne();
    res.json({ message: "Idea deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ideas/:id/interest
exports.expressInterest = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    if (idea.interestedInvestors.includes(req.user._id))
      return res.status(400).json({ message: "Already expressed interest" });

    idea.interestedInvestors.push(req.user._id);
    await idea.save();
    res.json({
      message: "Interest recorded",
      interestCount: idea.interestCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/ideas/:id/interest
exports.withdrawInterest = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    idea.interestedInvestors = idea.interestedInvestors.filter(
      (id) => id.toString() !== req.user._id.toString(),
    );
    await idea.save();
    res.json({
      message: "Interest withdrawn",
      interestCount: idea.interestCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInterestedIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ interestedInvestors: req.user._id })
      .sort({ createdAt: -1 })
      .populate("entrepreneur", "name");
    res.json({ ideas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInterestedIdeasByUser = async (req, res) => {
  try {
    const ideas = await Idea.find({ interestedInvestors: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('entrepreneur', 'name')
    res.json({ ideas })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}