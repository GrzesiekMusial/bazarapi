const Joi = require("joi");

const schema = {
    _id: Joi.string(),
    author: Joi.string(),
    category: Joi.string(),
    date: Joi.string(),
    price: Joi.string(),
    title: Joi.string().required(),
    text: Joi.string().allow(""),
    images: [Joi.string(), Joi.array()],
};

const validation = () => (req, res, next) => {
    const result = Joi.validate(req.body, schema);

    if (result.error) {
        throw { error: result.error.details[0].message };
    }
    next();
};

exports.schema = schema;
exports.validation = validation;
