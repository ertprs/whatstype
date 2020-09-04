"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
var util_1 = __importDefault(require("util"));
var Storage = require('@google-cloud/storage').Storage;
var storage = new Storage();
var bucket = storage.bucket('qrcodesfolder');
/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
exports.uploadImage = function (file) { return new Promise(function (resolve, reject) {
    var originalname = file.originalname, buffer = file.buffer;
    var blob = bucket.file(originalname.replace(/ /g, "_"));
    var blobStream = blob.createWriteStream({
        resumable: false
    });
    blobStream.on('finish', function () {
        var publicUrl = util_1.default.format("https://storage.googleapis.com/" + bucket.name + "/" + blob.name);
        resolve(publicUrl);
    })
        .on('error', function () {
        reject("Unable to upload image, something went wrong");
    })
        .end(buffer);
}); };
