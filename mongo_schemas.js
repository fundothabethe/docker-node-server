const { Schema, model } = require("mongoose");

const mongo_schema = new Schema({
  name: String,
  age: Number,
});

const User = model("User", mongo_schema);
module.exports = User;
