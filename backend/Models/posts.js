const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 6000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, maxlength: 1000 },
      },
    ],
  },

  { timestamps: true },
);

postSchema.index({ createdAt: -1 });
postSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
