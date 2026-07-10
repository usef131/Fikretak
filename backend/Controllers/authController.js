const jwt = require("jsonwebtoken");
const User = require("../models/User");

// create a function to sign a JWT token with the user's id and a secret key, and set an expiration time for the token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// first controller
exports.register = async (req, res) => {
  try {
    // get the name, email, password, and role from the request body
    const { name, email, password, role } = req.body;

    // check if the email is already registered, if yes then return 400 error
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });

    const allowedRoles = [
      "entrepreneur",
      "investor",
    ];

    if (!allowedRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    // create a new user with the provided data
    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);

    // send the user data and token back to the client (201 Created)
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

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
    const { name, bio, location, linkedin, sectors, ticketSize, experience, startup, stage, website } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, linkedin, sectors, ticketSize, experience, startup, stage, website },
      { new: true, runValidators: true },
    );
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


