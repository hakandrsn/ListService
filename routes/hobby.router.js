const router = require("express").Router();
const hobby = require("../controller/hobby.controller");

router.get("/", hobby.getHobbies);
router.get("/:id", hobby.getHobby)
router.post("/new", hobby.saveHobby);
router.put("/update", hobby.updateHobby);

module.exports = router;
