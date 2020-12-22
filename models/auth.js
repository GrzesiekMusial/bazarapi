const { User } = require("../models/user");
const Joi = require("joi");

const validateSchema = (user) => {
    const schema = {
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().min(3).max(1024).required(),
    };

    const result = Joi.validate(user, schema);
    return result;
};

exports.User = User;
exports.validateSchema = validateSchema;
