const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const session = require("express-session");
const { createClient } = require("redis");
const cookie_parser = require("cookie-parser");

let Redis_store = require("connect-redis")(session);

const {
  NODE_PORT,
  MONGO_USERNAME,
  MONGO_URL,
  MONGO_PORT,
  MONGO_PASSWORD,
  REDIS_URL,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_SECRET,
} = require("./config");

const Add_user = require("./db-schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

const redis_client = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_URL}:${REDIS_PORT}`,
  legacyMode: true,
});

// await redis_client.connect()

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
redis_client.connect().catch((_) => console.log(_));
app.use(cookie_parser());
app.use(
  session({
    store: new Redis_store({ client: redis_client }),
    secret: REDIS_SECRET,
    cookie: {
      secure: false,
      maxAge: 2 * 60000,
      httpOnly: true,
    },
  })
);

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
  // const all_users = await Add_user.find();

  // console.log(await redis_client.get("username", "fundo"));

  // await redis_client.disconnect();

  res.status(200).json({
    status: "success",
    data: "true",
  });
});

app.post("/api/v1/auth/sign-up", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(400).json({
        status: "fail",
        data: "Failed to hash password",
      });
    }

    // Store hash in your password DB.

    console.log(hash);
    const save_user = new Add_user({
      username,
      password: hash,
    });

    try {
      const saved_user = await save_user.save().catch((_) => {
        if (_.code === 11000)
          res.status(400).json({
            staus: "failed",
            data: "Username in use",
          });
        else
          res.status(400).json({
            staus: "failed",
            data: _,
          });
      });
      req.session.user = req.body;
      console.log(saved_user);
      res.status(200).json({
        status: "success",
        data: saved_user,
      });
    } catch (error) {
      console.log(error);
    }
  });
});

app.post("/api/v1/auth/sign-in", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user_data = await Add_user.findOne({ username });
    if (!user_data) return console.log("No user found");
    bcrypt.compare(password, user_data.password, async (err, result) => {
      if (err)
        return res.status(400).json({
          status: "fail",
          data: "Failed to hash password",
          auth_result: result,
        });
      if (result) {
        console.log(req.sessionID);
        console.log(user_data);
        req.session.user = user_data;

        res.status(200).json({
          status: "success",
          data: "Auth success",
        });
      } else
        res.status(200).json({ status: "success", data: "Incorrent password" });
    });
  } catch (error) {
    console.log(error);
  }
});

// LOGOUT

app.post("/api/v1/auth/sign-out", async (req, res) => {
  const { username } = req.body;

  try {
    req.session.destroy(() => {
      res.clearCookie("coonect.id", {});
      res.status(200).json({
        status: "success",
        data: "Logged out",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(NODE_PORT, () => console.log(`Service at PORT ${NODE_PORT}`));
