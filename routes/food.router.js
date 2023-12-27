const router = require("express").Router();
const food = require("../controller/food.controller");

router.get("/", food.getFoods);
router.get("/:id", food.getFood)
router.post("/new", food.saveFood);
router.put("/update", food.updateFood)

module.exports = router;
