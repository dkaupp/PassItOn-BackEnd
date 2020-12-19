const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateWith = require("../middleware/validation");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

router.post("/", validateWith(schema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).send("Invalid email or passwordemail");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
