const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/auth");
const { getInvestors, getUserById, toggleFollow, getFollowing } = require("../Controllers/userController");

// Require auth so member emails / PII aren't exposed publicly
router.get("/investors", protect, getInvestors);
router.get("/me/following", protect, getFollowing);
router.get("/investors/:id", protect, getUserById);
router.post("/investors/:id/follow", protect, toggleFollow);

module.exports = router;
