const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");

const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { Listing } = require("../models/listing");
const upload = require("../middleware/fileUpload");

const locationSchema = {
  location: Joi.string().min(1).required(),
};
const passwordSchema = {
  password: Joi.string().required().min(5),
};

const emailSchema = {
  email: Joi.string().email().required(),
};

router.get("/", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).send();

  const listings = await Listing.find({ userId }).lean();

  const imageUrls = user.image.url !== "" ? user.image : "";

  res.send({
    _id: user.id,
    name: user.name,
    email: user.email,
    numberOfListings: listings.length,
    listings: listings,
    location: user.location,
    image: { ...imageUrls },
  });
});

router.get("/:id", auth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).send();

  const listings = await Listing.find({ userId }).lean();

  const imageUrls = user.image.url !== "" ? user.image : "";

  res.send({
    _id: user.id,
    name: user.name,
    email: user.email,
    numberOfListings: listings.length,
    listings: listings,
    location: user.location,
    image: { ...imageUrls },
  });
});

router.patch("/photo", auth, upload.single("image"), async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).send("The user was not found .");

  user.image = {
    url: req.file.transforms[0].location,
  };

  user.save();

  res.send("Profile picture uploaded successfully.");
});

router.patch(
  "/location",
  [auth, validateWith(locationSchema)],
  async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(400).send("Invalid update parameter.");

    user.location = req.body.location;
    user.save();
    res.send("Location updated successfully");
  }
);
router.patch(
  "/password",
  [auth, validateWith(passwordSchema)],
  async (req, res) => {
    const user = await User.findById(req.user._id);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.save();

    res.send("Password updated successfully.");
  }
);
router.patch("/email", [auth, validateWith(emailSchema)], async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(400).send("Invalid update parameter.");

  user.email = req.body.email;

  user.save();
  res.send("Email updated successfully.");
});

module.exports = router;
