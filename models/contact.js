const { model, Schema } = require("mongoose");
const Joi = require("joi");
const emailExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameExp = /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/;
const phoneExp = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
const contactSchema = new Schema(
  {
    name: {
      type: String,
      match: nameExp,

      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: emailExp,
    },
    phone: {
      type: String,
      match: phoneExp,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { versionKey: false, timestamps: true }
);
const handleErrors = (error, data, next) => {
  const { name, code } = error;
  if (name === "MongoServerError" && code === 11000) {
    error.status = 409;
  } else {
    error.status = 400;
  }
  next();
};
contactSchema.post("save", handleErrors);
const Contact = model("contact", contactSchema);

const postSchema = Joi.object({
  name: Joi.string().pattern(nameExp).min(3).max(15).required(),
  email: Joi.string().pattern(emailExp).required(),
  phone: Joi.string().pattern(phoneExp).required(),
  favorite: Joi.boolean(),
});

const putSchema = Joi.object({
  name: Joi.string().pattern(nameExp).min(3).max(15).optional(),
  email: Joi.string().pattern(emailExp).optional(),
  phone: Joi.string().pattern(phoneExp).optional(),
  favorite: Joi.boolean(),
});

const patchSchema = Joi.object({
  favorite: Joi.boolean(),
});

module.exports = {
  Contact,
  postSchema,
  putSchema,
  patchSchema,
};
