const express = require("express");
const { authenticate } = require("../middleware/auth.mw");
const user = require("../controller/user.controller");

const router = express.Router();

router.get("/profile", authenticate, user.getProfile);
// router.get("/random", authenticate, user.ge);

router.put("/addmission", authenticate, user.addMission);
router.put("/completemission", authenticate, user.completemission);
router.put("/failedmission", authenticate, user.failedmission);
// router.get("/fix", user.fixGameList);




module.exports = router;
