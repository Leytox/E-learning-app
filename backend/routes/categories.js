const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Category = require("../models/Category");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { extname } = require("node:path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create a category (only admins)
router.post("/", auth, upload.single("file"), async (req, res) => {
  const { name, role } = req.body;
  try {
    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ msg: "You are not authorized to create a category" });
    const category = new Category({ name, picture: req.file.path });
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Edit a category by id (only admins)
router.put("/:id", auth, upload.single("file"), async (req, res) => {
  const { name, role } = req.body;
  try {
    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ msg: "You are not authorized to edit a category" });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    if (req.file) {
      fs.unlinkSync(category.picture);
      category.picture = req.file.path;
    }
    category.name = name;
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get a category by id
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
