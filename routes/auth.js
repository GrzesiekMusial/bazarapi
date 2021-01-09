const { User, validateSchema } = require("../models/auth");
const bcrypt = require("bcrypt");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validateSchema(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword)
        return res.status(400).send("Invalid email or password!");

    const token = user.generateAuthToken();

    res.header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(user, ["email", "login"]));
});

module.exports = router;
