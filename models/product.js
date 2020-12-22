const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        category: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        date: { type: Date, default: Date.now },
        price: String,
        title: { type: String, required: true, minlength: 3 },
        text: String,
    })
);

const validateSchema = (product) => {
    const schema = {
        author: Joi.objectId().required(),
        category: Joi.string().required(),
        date: Joi.date(),
        price: Joi.string(),
        title: Joi.string().required(),
        text: Joi.string(),
    };

    const result = Joi.validate(product, schema);
    return result;
};

exports.Product = Product;
exports.validateSchema = validateSchema;
