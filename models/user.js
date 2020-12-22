const Joi = require("joi");
const mongoose = require("mongoose");

const validateSchema = (user) => {
    const schema = {
        email: Joi.string().required().email().min(5).max(255),
        login: Joi.string().min(3).max(255).required(),
        name: Joi.string().min(3).max(50),
        password: Joi.string().min(3).max(1024).required(),
    };

    const result = Joi.validate(user, schema);
    return result;
};

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        email: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
            unique: true,
        },
        login: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
            unique: true,
        },
        name: { type: String, required: false, minlength: 3, maxlength: 50 },
        password: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 1024,
        },
    })
);

exports.User = User;
exports.validateSchema = validateSchema;
