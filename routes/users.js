const { User, validateSchema } = require("../models/user");

const express = require("express");
const router = express.Router();

// GET USERS
router.get("/", async (req, res) => {
    const result = await User.find();
    res.send(result);
});

//SAVE USER
router.post("/", async (req, res) => {
    const { error } = validateSchema(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const user = new User(req.body);

    try {
        await user.validate();
    } catch (ex) {
        return res.status(400).send(ex);
    }
    const result = await user.save();

    res.send(result);
});

//EDIT USER
router.put("/:id", async (req, res) => {
    const user = await User.findById(req.body._id);

    if (!user) return res.status(404).send("User with that id not exists!");

    user.set(req.body);

    try {
        await user.validate();
    } catch ({ message }) {
        return res.status(400).send(message);
    }

    const result = await User.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
    });

    res.send(result);
});

//DELETE USER
router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id); // params
    if (!user)
        return res.status(404).send("User with the givent id does not exist.");

    const users = await User.find();
    res.send(users);
});

// const getUsers = async () => {
//     // you can use operator to filtr find data (eg/negt/gte itd prefixed with $ ), pagination / limit
//     const users = await User.find({ authorId: "1" }).sort({ date: 1 });
//     return users;
// };

module.exports = router;
