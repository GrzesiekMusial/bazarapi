const express = require("express");
const router = express.Router();

const products = [
    { id: 0, name: "pierwszy" },
    { id: 1, name: "drugi" },
    { id: 3, name: "trzeci" },
];

const valdateSchema = (product) => {
    const schema = {
        name: Joi.string().min(3).required(),
    };

    const result = Joi.validate(product, schema);

    return result;
};

// products

router.delete("/:id", (req, res) => {
    const product = products.find((c) => c.id === parseInt(req.params.id)); // params
    if (!product)
        return res
            .status(404)
            .send("Product with the givent id does not exist.");

    const index = products.indexOf(product);

    products.splice(index, 1);

    res.send(product);
});

router.get("/:id", (req, res) => {
    const product = products.find((c) => c.id === parseInt(req.params.id)); // params
    if (!product)
        return res
            .status(404)
            .send("Product with the givent id does not exist.");
    res.send(product);
});

router.get("/", (req, res) => {
    res.send(products);
});

router.post("/", (req, res) => {
    const { error } = valdateSchema(req.body);

    if (error) {
        return res.status(400).send(result.error.details[0].message);
    }

    if (!req.body.name || req.body.name.length < 3) {
        return res
            .status(400)
            .send(
                "Invalid data! 'Name' property should have at last 3 characters!"
            );
    }

    const product = {
        id: products.length + 1,
        name: req.body.name,
    };

    products.push(product);

    res.send(product);
});

router.put("/:id", (req, res) => {
    const product = products.find((c) => c.id === parseInt(req.params.id));

    if (!product)
        return req.status(404).send("Product with that id not exists!");

    const { error } = valdateSchema(req.body);

    if (error) {
        return res.status(400).send(result.error.details[0].message);
    }

    product.name = req.body.name;

    res.send(product);
});

module.exports = router;
