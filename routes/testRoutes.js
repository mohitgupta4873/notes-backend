const express = require("express");
const router = express.Router();
const Test = require("../models/Test");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/test", authMiddleware, async (req, res) => {
  try {
    const newEntry = new Test({
      name: "Protected",
      role: `User ${req.userId}`,
    });

    await newEntry.save();

    res.json({
      message: "Protected route accessed 🔐",
      userId: req.userId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
