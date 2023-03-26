const { model, Schema } = require('mongoose');

const contactSchema = new Schema({
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
    owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
    }
})

const Contacts = model("Contacts", contactSchema)
module.exports = Contacts