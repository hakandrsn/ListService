const router = require("express").Router();
const random = require("../controller/random.controller");

router.post("/", random.randomActivity);

module.exports = router;
