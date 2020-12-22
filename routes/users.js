const { User, validateSchema } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

//GET USER
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
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
                    user.email === req.body.email ? "email" : "logn"
                } already registered.`
            );

    user = new User(_.pick(req.body, ["name", "login", "email", "password"]));

    try {
        await user.validate();
    } catch (ex) {
        return res.status(400).send(ex);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.header("x-auth-token", token).send(_.pick(user, ["email", "login"]));
});

module.exports = router;
