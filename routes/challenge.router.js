const router = require("express").Router();
const challenge = require("../controller/challenge.controller");

router.get("/", challenge.getchallenges);
router.get("/:id", challenge.getchallenge);
router.post("/new", challenge.savechallenge);
router.put("/update", challenge.updatechallenge);

module.exports = router;
