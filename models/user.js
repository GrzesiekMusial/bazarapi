const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

const validateSchema = (user) => {
    const schema = {
        email: Joi.string().required().email().min(5).max(255),
        login: Joi.string().min(3).max(50),
        password: Joi.string().min(3).max(1024).required(),
    };

    const result = Joi.validate(user, schema);
    return result;
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true,
    },
    login: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024,
    },

    isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { login: this.login, _id: this._id },
        config.get("jwtPrivateKey")
    );
    return token;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateSchema = validateSchema;
