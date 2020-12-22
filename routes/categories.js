const { Category, validateSchema } = require("../models/category");

const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.json());

// GET CATEGORIES
router.get("/", async (req, res) => {
    const result = await Category.find();
    res.send(result);
});

module.exports = router;
