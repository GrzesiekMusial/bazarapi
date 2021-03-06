const mongoose = require("mongoose");
const Joi = require("joi");

const Notice = mongoose.model(
    "Notice",
    new mongoose.Schema({
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        date: { type: Date, default: Date.now },
        title: { type: String, required: true, minlength: 3 },
        text: String,
        images: [{ type: String }],
    })
);

const validateSchema = (notice) => {
    const schema = {
        author: Joi.objectId().required(),
        date: Joi.date(),
        title: Joi.string().required(),
        text: Joi.string().allow(""),
        images: Joi.array().items(Joi.string()),
    };

    const result = Joi.validate(notice, schema);
    return result;
};

exports.Notice = Notice;
exports.validateSchema = validateSchema;
