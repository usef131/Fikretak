const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

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

    targetMarket: {
      type: String,
      default: "",
      trim: true,
    },

    fundingGoal: {
      type: Number,
      min: 0,
      default: 0,
    },

    fundingRaised: {
      type: Number,
      min: 0,
      default: 0,
    },

    teamSize: {
      type: Number,
      min: 1,
      default: 1,
    },

    image: {
      type: String,
      default: "",
    },

    mission: {
      type: String,
      default: "",
    },

    roadmap: {
      type: [roadmapSchema],
      default: [],
    },

    entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    interestedInvestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    investments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investment",
      },
    ],

    interestCount: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Full-text search
ideaSchema.index({
  title: "text",
  summary: "text",
  description: "text",
});

// Automatically update interestCount
ideaSchema.pre("save", function (next) {
  this.interestCount = this.interestedInvestors.length;
  next();
});

module.exports = mongoose.model("Idea", ideaSchema);