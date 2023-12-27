const router = require("express").Router();
const travel = require("../controller/travel.controller");

router.get("/", travel.getTravels);
router.get("/:id", travel.getTravel)
router.post("/new", travel.saveTravel);
router.put("/update", travel.updateTravel);

module.exports = router;
