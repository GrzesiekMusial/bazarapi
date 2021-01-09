const express = require("express");

const products = require("../routes/products.js");
const notices = require("../routes/notices");
const categories = require("../routes/categories");
const users = require("../routes/users");
const auth = require("../routes/auth");

const error = require("../middleware/error");

module.exports = function (app) {
    app.use(express.json());

    app.use("/products", products);
    app.use("/notices", notices);
    app.use("/categories", categories);
    app.use("/users", users);
    app.use("/auth", auth);

    app.use(error);
};
