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

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "/src/uploads")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/auth", route.auth);
app.use("/user", route.user);

app.use("/api/food", route.food);
app.use("/api/activity", route.activity);
app.use("/api/game", route.game);
app.use("/api/hobby", route.hobby);
app.use("/api/travel", route.travel);

app.use("/", (req, res, next) => {
  return res.status(200).json({ title: "başarılı" });
});

app.use(errorMw);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
