const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["entrepreneur", "investor"], required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // shared
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },

    // investor-only
    sectors: { type: [String], default: [] },
    ticketSize: { type: String, default: "" },
    experience: { type: String, default: "" },

    // entrepreneur-only
    startup: { type: String, default: "" },
    stage: {
      type: String,
      enum: ["", "idea", "mvp", "growth", "scaling"],
      default: "",
    },
    website: { type: String, default: "" },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Create function for each user instance to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password); // true / false
};

// Never return password in JSON
userSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
