const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const session = require("express-session");
const { createClient } = require("redis");
let RedisStore = require("connect-redis")(session);
const Add_user = require("./db-schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const {
  NODE_PORT,
  MONGO_USERNAME,
  MONGO_URL,
  MONGO_PORT,
  MONGO_PASSWORD,
} = require("./config");

const app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

const mongo_connection_url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URL}:${MONGO_PORT}`;
mongoose
  .connect(mongo_connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((_) => console.log(_))
  .finally(() => console.log("Done with database tasks"));

app.get("/api/v1/all-users", async (req, res) => {
  const all_users = await Add_user.find();
  res.status(200).json({
    status: "success",
    data: all_users,
  });
});

app.post("/api/v1/auth/sign-up", async (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err)
      return res.status(400).json({
        status: "fail",
        data: "Failed to hash password",
      });
    // Store hash in your password DB.

    console.log(hash);
    const save_user = new Add_user({
      username,
      password: hash,
    });
    const saved_user = await save_user.save();
    res.status(200).json({
      status: "success",
      data: saved_user,
    });
  });
});

app.post("/api/v1/auth/sign-in", async (req, res) => {
  const { username, password } = req.body;

  const user_data = await Add_user.findOne({ username });
  console.log(user_data);

  bcrypt.compare(password, user_data.password, async (err, result) => {
    if (err)
      return res.status(400).json({
        status: "fail",
        data: "Failed to hash password",
        auth_result: result,
      });
    res.status(200).json({
      status: "success",
      data: "Auth success",
      auth_result: result,
    });
  });
});

app.listen(NODE_PORT, () => console.log(`Service at PORT ${NODE_PORT}`));
