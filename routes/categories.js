const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { Category } = require("../models/caregory");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");

const schema = {
  name: Joi.string().required().min(1),
  icon: Joi.string().required().min(1),
  backgroundColor: Joi.string().required(),
  color: Joi.string().required(),
};

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { name, icon, backgroundColor, color } = req.body;

  let category = new Category({
    name,
    icon,
    backgroundColor,
    color,
  });
  await category.save();

  res.send(category);
});

module.exports = router;
