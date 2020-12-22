const config = require("config");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(helmet());

if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey is not defined!");
    process.exit(1);
}

const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const morgan = require("morgan");

const connectOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose
    .connect("mongodb://localhost/bazar", connectOptions)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log("couldnt connect to mongo db ", err));

const products = require("./routes/products.js");
const notices = require("./routes/notices");
const categories = require("./routes/categories");
const users = require("./routes/users");
const auth = require("./routes/auth");

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
app.use("/users", users);
app.use("/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`new connection on port ${port}`));
