const sharp = require("sharp");
const multer = require("multer");

const multerS3 = require("multer-s3-transform");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: process.env.REGION,
});

const s3 = new aws.S3({});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKED,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_META_DATA" });
    },
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now().toString() + file.originalname);
    },
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },

    transforms: [
      {
        id: "original",
        key: function (req, file, cb) {
          cb(
            null,
            Date.now().toString() + file.originalname + "-original.jpeg"
          );
        },
        transform: function (req, file, cb) {
          file.fieldname === "images"
            ? cb(null, sharp().resize(1000).jpeg())
            : cb(null, sharp().resize(200, 200).jpeg());
        },
      },
      {
        id: "thumbnail",
        key: function (req, file, cb) {
          cb(
            null,
            Date.now().toString() + file.originalname + "-thumbnail.jpeg"
          );
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(100, 100).jpeg());
        },
      },
    ],
  }),
});

module.exports = upload;
