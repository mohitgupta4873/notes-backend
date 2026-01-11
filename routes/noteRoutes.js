const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE NOTE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, pinned, archived, color } = req.body;

    const note = new Note({
      title,
      content,
      tags: tags || [],
      pinned: pinned || false,
      archived: archived || false,
      color: color || "#ffffff",
      user: req.userId, // 🔑 link note to logged-in user
    });

    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL NOTES FOR LOGGED-IN USER
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { archived } = req.query;
    const query = { user: req.userId };
    
    if (archived !== undefined) {
      query.archived = archived === "true";
    }
    
    const notes = await Note.find(query).sort({ 
      pinned: -1, // Pinned notes first
      createdAt: -1 
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId, // 🔒 ensure ownership
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.deleteOne();

    res.json({ message: "Note deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE NOTE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, pinned, archived, color } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (pinned !== undefined) updateData.pinned = pinned;
    if (archived !== undefined) updateData.archived = archived;
    if (color !== undefined) updateData.color = color;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // 🔒 ownership check
      updateData,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TOGGLE PIN
router.patch("/:id/pin", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.pinned = !note.pinned;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TOGGLE ARCHIVE
router.patch("/:id/archive", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.archived = !note.archived;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
