const express = require("express");
const { default: mongoose } = require("mongoose");
const User = require("./mongo_schemas");
const body_parser = require("body-parser");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const redis = require("redis");

const {
  PORT,
  MONGO_URL,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD,
} = require("./config");

const app = express();
const mongoose_url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URL}:${MONGO_PORT}`;

try {
  mongoose
    .connect(mongoose_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to database"));
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use((req, res, next) =>
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
  })
);

app.get("/", async (req, res) => {
  const all_users = await User.find({ name: "fundo" });
  res.status(200).json({
    status: "success",
    data: "all_users",
  });
});

app.post("/api/v1", async (req, res, next) => {
  try {
    // const new_users = await User.save(req.body);
    console.log(req.body);
    const new_user = new User(req.body);
    new_user.save();
    res.status(200).json({
      status: "success",
      data: new_user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      data: error,
    });
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
