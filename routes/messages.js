const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Expo } = require("expo-server-sdk");
const _ = require("lodash");

const { User } = require("../models/user");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { Message } = require("../models/message");
const { Listing } = require("../models/listing");

const schema = {
  listingId: Joi.string().required(),
  message: Joi.string().required(),
  read: Joi.boolean(),
  targetUserId: Joi.string().required(),
};

router.get("/", auth, async (req, res) => {
  const user = req.user;
  const messages = await Message.find({ toUserId: user._id });

  res.send(messages);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { listingId, message, targetUserId } = req.body;

  console.log(targetUserId);

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(400).send({ error: "Invalid listingId." });

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return res.status(400).send({ error: "Invalid userId." });

  let usermessage = new Message({
    toUserId: targetUser._id,
    fromUserId: req.user._id,
    fromUser: _.pick(req.user, ["_id", "name"]),
    toUser: _.pick(targetUser, ["_id", "name"]),
    listingId,
    content: message,
  });

  await usermessage.save();

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(expoPushToken, message);

  res.status(201).send();
});

router.delete("/:id", auth, async (req, res) => {
  const message = await Message.findByIdAndRemove(req.params.id);

  if (!message)
    return res.status(404).send("The message with the given id was not found.");

  res.send(message);
});

router.put("/:id", auth, async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    {
      read: true,
    },
    { new: true }
  );
  if (!message) return res.status(404).send("Invalid message ID.");

  res.send(message);
});

module.exports = router;
