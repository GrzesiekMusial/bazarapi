const config = require("config");
const Joi = require("joi");
const express = require("express");
const helmet = require("helmet");

const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const morgan = require("morgan");
const app = express();

const products = require("./routes/products");
const notices = require("./routes/notices");
const categories = require("./routes/categories");

app.use(express.json());
app.use(helmet());

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    startupDebugger("Morgan enabled");
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/products", products);
app.use("/notices", notices);
app.use("/categories", categories);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`new connection on port ${port}`));
