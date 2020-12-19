const express = require("express");
const router = express.Router();

const categories = [
    { id: 0, name: "pierwszy" },
    { id: 1, name: "drugi" },
    { id: 3, name: "trzeci" },
];

router.get("/", (req, res) => {
    res.send(categories);
});

module.exports = categories;
