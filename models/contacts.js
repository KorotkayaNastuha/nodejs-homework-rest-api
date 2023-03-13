const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
})

const Contacts = model("Contacts", userSchema)
module.exports = Contacts