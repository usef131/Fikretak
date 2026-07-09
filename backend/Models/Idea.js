const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    summary: { type: String, required: true, maxlength: 300 },
    description: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: [
        "Tech",
        "Health",
        "Education",
        "Finance",
        "Environment",
        "Social",
        "Other",
      ],
    },
    targetMarket: { type: String, default: "" },
    fundingGoal: { type: Number, default: null },
    fundingRaised: { type: Number, default: 0 },
    image: { type: String, default: '' },
    mission: { type: String, default: '' },
    impactScore: { type: String, default: '8.4/10' },
    marketSize: { type: String, default: '$12B' },
    userGrowth: { type: String, default: '+24%' },
    co2Saved: { type: String, default: '1.2k t' },
    roadmap: { type: Array, default: [] },

    teamMembers: { type: Number, default: 1 },
    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    

    interestedInvestors: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    investments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Investment" }],
    interestCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Text search index
ideaSchema.index({ title: "text", summary: "text", description: "text" });

// Keep interestCount in sync
ideaSchema.pre("save", function (next) {
  this.interestCount = this.interestedInvestors.length;
  next();
});

module.exports = mongoose.model("Idea", ideaSchema);
