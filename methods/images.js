const fs = require("fs");
var multer = require("multer");
const winston = require("winston");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            req.user._id + "-" + file.fieldname + "-" + Date.now() + ".png"
        );
    },
});

const imageDelete = async (id) => {
    const pathToFile = "public/images/";
    fs.unlink(`${pathToFile}${id}`, function (err) {
        if (err) winston.error(`Image not exists! ${id}`);
    });
};

const imageFilter = async (fileImg, freshImg = null, oldImg = null) => {
    freshImg = typeof freshImg === "string" ? freshImg.split(",") : [];

    if (oldImg) {
        await oldImg.forEach(async (img) => {
            if (freshImg.length === 0) await imageDelete(img);
            else
                for (key in freshImg) {
                    if (freshImg[key] == img) break;
                    else if (key + 1 == freshImg.length) {
                        await imageDelete(img);
                    }
                }
        });
    }

    await fileImg.forEach((file) => freshImg.push(file.filename));

    return freshImg;
};

const upload = multer({
    storage: storage,
    limits: {
        fields: 8,
        fieldNameSize: 50, //  Check if this size is enough
        fieldSize: 20000, //T Check if this size is enough
        fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
}).array("file", 6);

exports.upload = upload;
exports.imageFilter = imageFilter;
