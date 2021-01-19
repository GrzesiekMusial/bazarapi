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

//SAVE NOTICE
router.post("/", async (req, res) => {
    const newOne = req.body;

    const question = new Question(newOne);
    await question.validate();
    const result = await question.save();

    res.status(201).send({ result });
});

module.exports = router;
