const mongoose = require("mongoose");
const Joi = require("joi");

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        images: [{ type: String }],
        date: { type: Date, default: Date.now },
        price: Number,
        title: { type: String, required: true, minlength: 3 },
        text: String,
    })
);

const validateSchema = (product) => {
    const schema = {
        author: Joi.objectId(),
        category: Joi.string().required(),
        date: Joi.date(),
        price: Joi.string(),
        title: Joi.string().required(),
        text: Joi.string().allow(""),
        images: Joi.array().items(Joi.string()),
    };

    const result = Joi.validate(product, schema);

    return result;
};

exports.Product = Product;
exports.validateSchema = validateSchema;
