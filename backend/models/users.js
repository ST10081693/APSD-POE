const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  password: { type: String, required: true },
  department: { type: String, required: true },
});

userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be a unique path.",
});

module.exports = mongoose.model("User", userSchema);
