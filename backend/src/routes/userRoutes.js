const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/User");

const router = express.Router();


router.post("/interests", authMiddleware, async (req, res) => {
  try {
    const { interests } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { interests },
      { new: true }
    );

    res.json({
      message: "Interests updated",
      interests: user.interests,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

module.exports = router;
