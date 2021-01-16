const { Notice, validateSchema } = require("../models/notice");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validation");
const { imageFilter, upload } = require("../methods/images");
const { userCheck } = require("../methods/user");

//GET NOTICE
router.get("/:id", async (req, res) => {
    const notice = await Notice.findById(req.params.id)
        .populate("author", "login email")
        .populate("category");

    if (!notice) return res.status(404).send("Notice with that id not exists!");

    res.send(notice);
});

// GET NOTICES
router.get("/", async (req, res) => {
    const result = await Notice.find()
        .populate("category")
        .populate("author", "login email");
    res.send(result);
});

//SAVE NOTICE
router.post("/", [auth, upload, validate.validation()], async (req, res) => {
    const newOne = req.body;

    newOne.date = Date.now();
    newOne.author = req.user._id;
    newOne.images = await imageFilter(req.files);

    const notice = new Notice(newOne);
    await notice.validate();
    const result = await notice.save();

    const author = { _id: req.user._id, login: req.user.login };
    res.status(201).send({ item: result, author: author });
});

//EDIT NOTICE
router.put("/:id", [auth, upload, validate.validation()], async (req, res) => {
    const edit = req.body;

    const old = await Notice.findById(edit._id);
    if (!old) return res.status(404).send("Notice with that id not exists!");

    await userCheck(req.user._id, old.author._id);

    edit.date = old.date;
    edit.author = old.author;
    edit.images = await imageFilter(req.files, req.body.images, old.images);

    const result = await Notice.findByIdAndUpdate(edit._id, edit, {
        new: true,
        useFindAndModify: false,
    });

    const author = { _id: req.user._id, login: req.user.login };
    res.status(201).send({ item: result, author: author });
});

//DELETE NOTICE
router.delete("/:id", auth, async (req, res) => {
    const notice = await Notice.findById(req.params.id); // params

    if (!notice) {
        return res
            .status(404)
            .send("Notice with the givent id does not exist.");
    }

    await userCheck(req.user._id, notice.author._id, res);

    imageFilter([], [], notice.images);

    const result = await Notice.findByIdAndRemove(req.params.id); // params

    res.status(200).send(result);
});

module.exports = router;
