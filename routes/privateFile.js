const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Question = mongoose.model(
    "Question",
    new mongoose.Schema({
        Q: String,
        R: String,
    })
);

// GET QUESTIONS
router.get("/", async (req, res) => {
    const result = await Question.find();
    res.send(result);
});

module.exports = router;
