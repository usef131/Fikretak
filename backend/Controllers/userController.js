const User = require("../models/User");

exports.getInvestors = async (req, res) => {
  try {
    const investors = await User.find({ role: "investor" });

    res.json({ investors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userObj = user.toObject();
    userObj.followersCount = user.followers?.length || 0;
    userObj.followingCount = user.following?.length || 0;

    res.json({ user: userObj });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following', 'name role avatar bio location sectors ticketSize startup stage')
    res.json({ following: user.following })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.toggleFollow = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user._id.toString();

    if (targetId === currentUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const currentUser = await User.findById(currentUserId);

    const alreadyFollowing = targetUser.followers.some(
      (id) => id.toString() === currentUserId,
    );

    if (alreadyFollowing) {
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId,
      );
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetId,
      );
    } else {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetId);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({
      isFollowing: !alreadyFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
