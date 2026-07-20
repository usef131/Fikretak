const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sign a JWT with the user's id. Algorithm pinned to prevent alg-confusion.
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic input validation
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const allowedRoles = ["entrepreneur", "investor"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);
    // toJSON transform strips the password hash
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateMe = async (req, res) => {
  try {
    // Whitelist of self-editable fields (role/email/password not editable here)
    const allowed = [
      "name", "bio", "location", "linkedin", "sectors",
      "ticketSize", "experience", "startup", "stage", "website",
    ];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
