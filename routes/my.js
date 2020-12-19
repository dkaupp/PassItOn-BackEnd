const express = require("express");
const router = express.Router();

const { Listing } = require("../models/listing");
const auth = require("../middleware/auth");

router.get("/listings", auth, async (req, res) => {
  const listings = await Listing.find({ userId: req.user._id }).lean();
  res.send(listings);
});

module.exports = router;
