const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

router.post(
  "/",
  [auth, validateWith({ token: Joi.string().required() })],
  async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).send({ error: "Invalid user." });

    user.expoPushToken = req.body.token;
    user = await user.save();
    console.log("User registered for notifications: ", user);
    res.status(201).send();
  }
);

module.exports = router;
