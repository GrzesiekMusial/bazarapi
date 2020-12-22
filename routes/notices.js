const { validateSchema, Notice } = require("../models/notice");

const express = require("express");
const router = express.Router();

// GET NOTICES
router.get("/", async (req, res) => {
    const result = await Notice.find().populate("author", "name email login");
    res.send(result);
});

//SAVE NOTICE
router.post("/", async (req, res) => {
    const { error } = validateSchema(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const notice = new Notice(req.body);

    try {
        await notice.validate();
    } catch (ex) {
        return res.status(400).send(ex);
    }
    await notice.save();

    res.send(notice);
});

//EDIT NOTICE
router.put("/:id", async (req, res) => {
    const notice = await Notice.findById(req.body._id);

    if (!notice) return res.status(404).send("Notice with that id not exists!");

    notice.set(req.body);

    try {
        await notice.validate();
    } catch ({ message }) {
        return res.status(400).send(message);
    }

    const result = await Notice.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
    });

    res.send(result);
});

//DELETE NOTICE
router.delete("/:id", async (req, res) => {
    const notice = await Notice.findByIdAndRemove(req.params.id); // params
    if (!notice)
        return res
            .status(404)
            .send("Notice with the givent id does not exist.");

    const notices = await Notice.find();
    res.send(notices);
});

// const getNotices = async () => {
//     // you can use operator to filtr find data (eg/negt/gte itd prefixed with $ ), pagination / limit
//     const notices = await Notice.find({ authorId: "1" }).sort({ date: 1 });
//     return notices;
// };

module.exports = router;
