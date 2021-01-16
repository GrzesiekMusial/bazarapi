const fs = require("fs");
var multer = require("multer");
const config = require("config");
const winston = require("winston");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const { concat } = require("lodash");

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
    await cloudinary.uploader.destroy(id, { folder: "bazar" }, function (err) {
        if (err) winston.error(`Image not exists! ${id}`);
    });
};

const imagesUpload = async (images) => {
    const arr = [];
    for (const img of images) {
        const result = await cloudinary.uploader.upload(img.path, {
            quality: 20,
            folder: "bazar",
        });
        arr.push(result.public_id);
    }
    return arr;
};

const imageFilter = async (fileImg, freshImg = null, oldImg = null) => {
    console.log("FILTER START ", freshImg, oldImg, fileImg);
    freshImg =
        typeof freshImg === "string"
            ? freshImg.split(",")
            : freshImg
            ? freshImg
            : [];

    if (oldImg) {
        for (const img of oldImg) {
            console.log(img);
            if (freshImg.length === 0) await imageDelete(img);
            else
                for (let i = 0; i < freshImg.length; i++) {
                    console.log("check ", freshImg[i], img);
                    if (freshImg[i] === img) break;
                    if (i + 1 === freshImg.length) {
                        console.log("dlt ", img);
                        await imageDelete(img);
                    }
                }
        }
    }

    console.log("FILTER upload ", freshImg);

    const filesUpload = await imagesUpload(fileImg);
    console.log("FILTER uploaded ");

    for await (const img of freshImg) filesUpload.push(img);

    console.log("FILTER result ", filesUpload);

    return filesUpload;
};

const upload = multer({
    storage: storage,
    // limits: {
    // fields: 6,
    // fieldNameSize: 50, //  Check if this size is enough
    // fieldSize: 20000, //T Check if this size is enough
    // fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
    // },
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
