const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getInvestors, getUserById, toggleFollow , getFollowing  } = require("../controllers/userController");

router.get("/investors", getInvestors);
router.get("/investors/:id", getUserById);
router.post("/investors/:id/follow", protect, toggleFollow);
router.get("/me/following", protect, getFollowing);
module.exports = router;