const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const validate = require("../middleware/validation");
const { Product } = require("../models/product");
const { imageFilter, upload } = require("../methods/images");
const { userCheck } = require("../methods/user");

//GET PRODUCT
router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate("author", "name email login")
        .populate("category");

    if (!product)
        return res.status(404).send("Product with that id not exists!");

    res.send(product);
});

// GET PRODUCTS
router.get("/", async (req, res) => {
    const result = await Product.find()
        .populate("category")
        .populate("author", "name email login");
    res.send(result);
});

//SAVE PRODUCT
router.post("/", [auth, upload, validate.validation()], async (req, res) => {
    const newOne = req.body;
    newOne.price = parseFloat(newOne.price, 2);

    newOne.date = Date.now();
    newOne.author = req.user._id;
    newOne.images = await imageFilter(req.files);

    const product = new Product(newOne);
    await product.validate();
    const result = await product.save();

    res.status(201).send(result);
});

//EDIT PRODUCT
router.put("/:id", [auth, upload, validate.validation()], async (req, res) => {
    const edit = req.body;
    edit.price = parseFloat(edit.price, 2);

    const old = await Product.findById(edit._id);
    if (!old) return res.status(404).send("Product with that id not exists!");

    await userCheck(req.user._id, old.author._id);

    edit.date = old.date;
    edit.author = old.author;
    edit.images = await imageFilter(req.files, req.body.images, old.images);

    const result = await Product.findByIdAndUpdate(edit._id, edit, {
        new: true,
        useFindAndModify: false,
    });

    res.status(201).send(result);
});

//DELETE PRODUCT
router.delete("/:id", auth, async (req, res) => {
    const product = await Product.findById(req.params.id); // params

    if (!product)
        return res
            .status(404)
            .send("Product with the givent id does not exist.");

    await userCheck(req.user._id, product.author._id);

    imageFilter([], [], product.images);

    const result = await Product.findByIdAndRemove(req.params.id); // params

    res.status(200).send(result);
});

// const getProducts = async () => {
//     // you can use operator to filtr find data (eg/negt/gte itd prefixed with $ ), pagination / limit
//     const products = await Product.find({ authorId: "1" }).sort({ date: 1 });
//     return products;
// };

module.exports = router;
