require("dotenv").config();
require("./connection/mongoose");
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const route = require("./routes");
const errorMw = require("./middleware/error.mw");
const morgan = require("morgan");
const path = require("path");
const {
  USER,
  FOOD,
  ACTİVİTY,
  GAME,
  HOBBY,
  TRAVEL,
  AUTH,
} = require("./constant/keywords");

app.use(cors());
app.use(express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "/src/uploads")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(`/${AUTH}`, route.auth);
app.use(`/${USER}`, route.user);

app.use(`/api/${FOOD}`, route.food);
app.use(`/api/${ACTİVİTY}`, route.activity);
app.use(`/api/${GAME}`, route.game);
app.use(`/api/${HOBBY}`, route.hobby);
app.use(`/api/${TRAVEL}`, route.travel);

app.use("/", (req, res, next) => {
  return res.status(200).json({ title: "başarılı" });
});

app.use(errorMw);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
