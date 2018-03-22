const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  date: {
    type: Date,
    default: Date.now
  }
});

var User = mongoose.model("users", UserSchema);

module.exports = { User };
