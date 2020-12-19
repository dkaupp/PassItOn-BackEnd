const mongoose = require("mongoose");

const Message = mongoose.model(
  "Messages",
  new mongoose.Schema({
    toUserId: {
      type: String,
      required: true,
    },
    fromUserId: {
      type: String,
      required: true,
    },
    fromUser: {
      type: new mongoose.Schema({
        name: {
          type: String,
        },
        _id: { type: String, unique: false },
      }),
      required: true,
    },
    toUser: {
      type: new mongoose.Schema({
        name: {
          type: String,
        },
        _id: { type: String, unique: false },
      }),
      required: true,
    },
    listingId: {
      type: String,
      required: true,
      unique: false,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    dateTime: {
      type: Date,
      default: Date.now(),
    },
  })
);

exports.Message = Message;
