const fs = require("fs");
var multer = require("multer");
const config = require("config");
const winston = require("winston");
const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
    cloud_name: config.get("cloudinary_name"),
    api_key: config.get("cloudinary_key"),
    api_secret: config.get("cloudinary_secret"),
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "upload"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const imageDelete = async (id) => {
    await cloudinary.uploader.destroy(id, function (err) {
        if (err) winston.error(`Image not exists! ${id}`);
    });
};

const imagesUpload = async (images) => {
    const arr = [];
    for (const img of images) {
        const result = await cloudinary.uploader.upload(img.path);
        arr.push(result.public_id);
    }
    return arr;
};

const imageFilter = async (fileImg, freshImg = null, oldImg = null) => {
    freshImg = typeof freshImg === "string" ? freshImg.split(",") : [];

    if (oldImg) {
        for (const img of oldImg) {
            if (freshImg.length === 0) await imageDelete(img);
            else
                for (key in freshImg) {
                    if (freshImg[key] == img) break;
                    else if (key + 1 == freshImg.length) {
                        await imageDelete(img);
                    }
                }
        }
    }

    freshImg = await imagesUpload(fileImg);

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
