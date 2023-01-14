const mongoose = require("mongoose");

const add_user = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Username is required!"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Add_user", add_user);
