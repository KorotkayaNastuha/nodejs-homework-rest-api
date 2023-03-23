const Joi = require('joi')

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const registerSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string()
});

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = { contactSchema, updateFavoriteSchema, registerSchema, loginSchema }
