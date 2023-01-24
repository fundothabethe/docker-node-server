const mongoose = require("mongoose");

const add_user = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Username is required!"],
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Add_user", add_user);
