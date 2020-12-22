const { Product, validateSchema } = require("../models/product");

const express = require("express");
const router = express.Router();

// GET PRODUCTS
router.get("/", async (req, res) => {
    const result = await Product.find().populate("author", "name email login");
    res.send(result);
});

//SAVE PRODUCT
router.post("/", async (req, res) => {
    const { error } = validateSchema(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const product = new Product(req.body);

    try {
        await product.validate();
    } catch (ex) {
        return res.status(400).send(ex);
    }

    await product.save();

    res.send(product);
});

//EDIT PRODUCT
router.put("/:id", async (req, res) => {
    const product = await Product.findById(req.body._id);

    if (!product)
        return res.status(404).send("Product with that id not exists!");

    product.set(req.body);

    try {
        await product.validate();
    } catch ({ message }) {
        return res.status(400).send(message);
    }

    const result = await Product.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
    });

    res.send(result);
});

//DELETE PRODUCT
router.delete("/:id", async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id); // params
    if (!product)
        return res
            .status(404)
            .send("Product with the givent id does not exist.");

    const products = await Product.find();
    res.send(products);
});

// const getProducts = async () => {
//     // you can use operator to filtr find data (eg/negt/gte itd prefixed with $ ), pagination / limit
//     const products = await Product.find({ authorId: "1" }).sort({ date: 1 });
//     return products;
// };

module.exports = router;
