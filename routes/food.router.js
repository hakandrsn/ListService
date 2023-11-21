const router = require("express").Router();
const food = require("../controller/food.controller");

router.get("/", food.getAllFood);
router.get("/main", food.getFood);
router.post("/new", food.setFood);

module.exports = router;
