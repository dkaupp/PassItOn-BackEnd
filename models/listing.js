const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      minlength: 1,
    },
    categoryId: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
        },
        thumbnailUrl: {
          type: String,
        },
      },
    ],
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listings", listingSchema);

exports.Listing = Listing;
