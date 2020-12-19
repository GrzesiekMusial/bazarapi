const express = require("express");
const router = express.Router();

const notices = [
    { id: 0, name: "pierwszy" },
    { id: 1, name: "drugi" },
    { id: 3, name: "trzeci" },
];

const valdateSchema = (product) => {
    const schema = {
        name: Joi.string().min(3).required(),
    };

    const result = Joi.validate(product, schema);

    return result;
};

router.delete("/:id", (req, res) => {
    const notice = notices.find((c) => c.id === parseInt(req.params.id)); // params
    if (!notice)
        return res
            .status(404)
            .send("notice with the givent id does not exist.");

    const index = notices.indexOf(notice);

    notices.splice(index, 1);

    res.send(notice);
});

router.get("/:id", (req, res) => {
    const notice = notices.find((c) => c.id === parseInt(req.params.id)); // params
    if (!notice)
        return res
            .status(404)
            .send("notice with the givent id does not exist.");
    res.send(notice);
});

router.get("/", (req, res) => {
    res.send(notices);
});

router.post("/", (req, res) => {
    const { error } = valdateSchema(req.body);

    if (error) {
        return res.status(400).send(result.error.details[0].message);
    }

    if (!req.body.name || req.body.name.length < 3) {
        return res
            .status(400)
            .send(
                "Invalid data! 'Name' property should have at last 3 characters!"
            );
    }

    const notice = {
        id: notices.length + 1,
        name: req.body.name,
    };

    notices.push(notice);

    res.send(notice);
});

router.put("/:id", (req, res) => {
    const notice = notices.find((c) => c.id === parseInt(req.params.id));

    if (!notice) return req.status(404).send("notice with that id not exists!");

    const { error } = valdateSchema(req.body);

    if (error) {
        return res.status(400).send(result.error.details[0].message);
    }

    notice.name = req.body.name;

    res.send(notice);
});

module.exports = router;
