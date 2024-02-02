const router = require("express").Router();
const challange = require("../controller/challange.controller");

router.get("/", challange.getchallanges);
router.get("/:id", challange.getchallange);
router.post("/new", challange.savechallange);
router.put("/update", challange.updatechallange);

module.exports = router;
