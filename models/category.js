const Joi = require("joi");
const mongoose = require("mongoose");

const validateSchema = (category) => {
    const schema = {
        name: Joi.string().required(),
    };

    const result = Joi.validate(category, schema);
    return result;
};

const Category = mongoose.model(
    "Category",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            enum: [
                "domowe",
                "spiżarnia",
                "moda",
                "elektronika",
                "samochód",
                "inne",
            ],
            lowercase: true,
        },
    })
);

exports.Category = Category;
exports.validateSchema = validateSchema;
