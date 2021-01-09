const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

const connectOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: true,
};

module.exports = function () {
    const db = config.get("db", connectOptions);
    mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
};
