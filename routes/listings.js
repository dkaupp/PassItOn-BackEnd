const express = require("express");
const router = express.Router();
const Joi = require("joi");

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const config = require("config");
const upload = require("../middleware/fileUpload");

const { Listing } = require("../models/listing");
const { Category } = require("../models/caregory");

const schema = {
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required().min(1),
  categoryId: Joi.string().required().min(1),
  location: Joi.string().required().min(1),
};

const validateCategoryId = async (req, res, next) => {
  const category = await Category.findById(req.body.categoryId);

  if (!category) return res.status(400).send({ error: "Invalid categoryId." });

  next();
};

router.get("/", async (req, res) => {
  throw new Error("There was and error ");
  const listings = await Listing.find().lean().sort({ _id: -1 });
  if (!listings)
    return res.status(400).send("There was and error loading the listings.");

  res.send(listings);
});

router.get("/:userId", async (req, res) => {
  const listings = await Listing.find({ userId: req.params.userId }).lean();

  if (!listings)
    return res.status(400).send("There was and error loading the listings.");

  res.send(listings);
});

router.post(
  "/",
  [
    auth,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    validateCategoryId,
  ],
  async (req, res) => {
    let listing = new Listing({
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: req.body.categoryId,
      description: req.body.description,
      location: req.body.location,
      userId: req.user._id,
    });

    listing.images = req.files.map((file) => ({
      url: file.transforms[1].location,
      thumbnailUrl: file.transforms[0].location,
    }));

    listing = await listing.save();

    res.status(201).send(listing);
  }
);

router.put(
  "/:id",
  auth,
  upload.array("images", config.get("maxImageCount")),
  validateWith(schema),
  validateCategoryId,
  async (req, res) => {
    const { title, price, categoryId, description, location } = req.body;
    let listing = await Listing.findById(req.params.id);

    listing.title = title;
    listing.price = parseFloat(price);
    listing.category = categoryId;
    listing.description = description;
    listing.location = location;

    listing.images = req.files.map((file) => ({
      url: file.transforms[1].location,
      thumbnailUrl: file.transforms[0].location,
    }));

    listing = await listing.save();

    res.send(listing);
  }
);

router.delete("/:id", auth, async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);

  if (!listing)
    return res
      .status(400)
      .send("There was and error while deleting the listing.");

  res.send("Listing deleted successfully.");
});

module.exports = router;
