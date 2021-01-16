const { User, validateSchema } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

//GET USER
router.get("/me", auth, async (req, res) => {
    const result = await User.findById(req.user._id).select("-password");
    if (!result) return res.status(404).send("User not found!");
    res.status(200).send(result);
});

//GET USERS
router.get("/", async (req, res) => {
    const result = await User.find().select("-password");
    if (!result) return res.status(404);
    res.status(200).send(result);
});

// GET PRODUCTS
router.get("/", async (req, res) => {
    const result = await Product.find()
        .populate("category")
        .populate("author", "login email");
    res.send(result);
});

//SAVE USER
router.post("/", async (req, res) => {
    const { error } = validateSchema(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        $or: [{ email: req.body.email }, { login: req.body.login }],
    });

    if (user)
        return res
            .status(400)
            .send(
                `User with that ${
                    user.email === req.body.email ? "email" : "login"
                } already registered.`
            );

    user = new User(_.pick(req.body, ["login", "email", "password"]));

    await user.validate();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .status(201)
        .send(_.pick(user, ["email", "login"]));
});

module.exports = router;
