const images = () => (req, res, next) => {
    if (req.body.images) req.body.images = req.body.images.split(",");

    next();
};

exports.product = product;
exports.validation = validation;
